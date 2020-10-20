import { Request, Response, Router } from "express";

import { Pool } from "../db";
import { getUserId, addCategory, addFeed, deleteCategorymap, deleteUseritemmapByFeedId, updateCategorymap, checkCategory, getFeed } from "../common"

const feedRouter: Router = Router()


// get all feeds with category informations
feedRouter.post('/subscribe', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid)
	return resp.json({'status':'error', 'message':'no uid'})

    let url = req.body.url
    if (!!!url)
	return resp.json({'status':'error', 'message':'missing url'})

    url = url.trim()
    if (!url.match(/^https?:\/\//i))
	return resp.json({'status':'error', 'message':'invalid url='+url})


    // カテゴリの確認
    let cat_id
    try {
	cat_id = await checkCategory(uid, req)
    } catch (e) {
	return resp.json({'status': 'error', 'message': e})
    }

    // 該当 url の feed がすでにあるか確認
    const [frows, ffields] = await Pool.query('SELECT id FROM feed WHERE url = ?', [url])
    let feed_id:number
    if (Array.isArray(frows) && frows.length) {
	// あった
	feed_id = Number(frows[0]['id'])
    } else {
	// ない
	const fret = await addFeed(url)
	console.log(fret)
	if (!!!fret || fret[0].affectedRows != 1)
	    return resp.json({'status':'error', 'message':'DB feed insert error'})
	feed_id = Number(fret[0].insertId)
    }

    // categorymap の更新
    try {
	const ret = await Pool.query('INSERT INTO categorymap (category_id, feed_id, user_id) VALUES (?,?,?)',[cat_id, feed_id, uid]);
	return resp.json({'status': 'ok', 'message': 'subscribed', 'feed_id': feed_id})
    } catch (e) {
	if (e.code == 'ER_DUP_ENTRY')
	    return resp.json({'status': 'error', 'message': 'feed already subscribed'})
	console.log(e)
	return resp.json({'status': 'error', 'messsage': 'categorymap insert failed: '+e.code})
    }
})

// get all feeds with category informations
feedRouter.post('/unsubscribe', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid)
	return resp.json({'status':'error', 'message':'no uid'})

    let feed_id:number = Number(req.body.feed_id)

    try {
	const ret = await deleteCategorymap(uid, feed_id)
	if (!!!ret || ret[0].affectedRows != 1)
	    return resp.json({'status':'error', 'message':'not found feed_id='+feed_id})
	const ret2 = await deleteUseritemmapByFeedId(uid, feed_id)
	return resp.json({'status':'ok', 'message':'unsubscrined feed_id='+feed_id, 'feed_id': feed_id})
    } catch (e) {
	console.log(e)
	return resp.json({'status': 'error', 'messsage': 'categorymap delete failed: '+e.code})
    }
})

feedRouter.post('/edit', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid)
	return resp.json({'status':'error', 'message':'no uid'})

    const feed_id:number = Number(req.body.feed_id)
    // そもそも 該当フィード subscribe してる?
    const [crows,cfields] = await Pool.query('SELECT * FROM categorymap WHERE user_id = ? AND feed_id = ?', [uid, feed_id])
    if (!!!crows || ! Array.isArray(crows) || !crows.length)
	return resp.json({'status': 'error', 'messsage': "You don't have subscription for feed_id="+feed_id})

    // カテゴリの確認
    let cat_id
    try {
	cat_id = await checkCategory(uid, req)
    } catch (e) {
	return resp.json({'status': 'error', 'message': e})
    }

    const name = req.body.name
    try {
	const ret = await updateCategorymap(crows[0]['id'], cat_id, name)
	if (!!!ret || ret[0].affectedRows != 1)
	    return resp.json({'status':'error', 'message':'categorymap update failed feed_id='+feed_id})
	return resp.json({'status':'ok', 'message':'feed updated feed_id='+feed_id, 'feed_id': feed_id})
    } catch (e) {
	console.log(e)
	return resp.json({'status': 'error', 'messsage': 'categorymap update failed internal error: '+e.code})
    }
})

feedRouter.get('/:feed_id([0-9]+)', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid)
	return resp.json({})
    const feed_id:number = Number(req.params.feed_id)

    const [rows, fields] = await getFeed(uid, feed_id)
    if (!!!rows || ! Array.isArray(rows) || !rows.length)
	return resp.json({})

    return resp.json(rows[0])
})

export { feedRouter }

import { Request, Response, Router } from "express";

import { Pool } from "../db";
import { getUserId, getFeedsByCategoryId, getCategories } from "../common"

const feedsRouter: Router = Router()

// get all feeds with category informations
feedsRouter.post('/', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const [rows, fields] = await Pool.query("SELECT cm.category_id, f.id as feed_id, COALESCE(cm.feed_label, f.name, 'NO_NAME') as feed_name, c.name as category_name, f.url, f.web_url FROM categorymap as cm, feed as f, category as c WHERE cm.category_id = c.id AND cm.feed_id = f.id AND cm.user_id = ? AND UNIX_TIMESTAMP(f.updated_at) > 0 ORDER by c.name, feed_label", [uid])
    return resp.json(rows)
})

feedsRouter.post('/tree', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const [rows, fields] = await getCategories(uid)
    let ret = []
    for (let i = 0; i < rows.length; i++) {
	let cat_id = Number(rows[i]['id'])
	const [rows2, fields2] = await getFeedsByCategoryId(uid, cat_id)
	ret.push({category_id: cat_id, category_name: rows[i]['name'], feeds: rows2})
    }
    return resp.json(ret)
})

// get feeds info select by category_id with unread count
feedsRouter.post('/:cat_id([0-9]+)', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const cat_id:number = Number(req.params.cat_id)

    const [rows, fields] = await getFeedsByCategoryId(uid, cat_id)
    let ret = []
    for (let i = 0 ; i < rows.length; i++) {
	const feed_id:number = Number(rows[i]['id'])
	const [rows2, fields2] = await Pool.query('SELECT count(id) as unread FROM useritemmap WHERE status != 1 AND feed_id = ?', [feed_id])
	const unread = Number(rows2[0]['unread'])
        ret.push({id: feed_id, 'cat_id': cat_id, name: rows[i]['name'], unread: unread})
    }
    return resp.json(ret)
})

export { feedsRouter }

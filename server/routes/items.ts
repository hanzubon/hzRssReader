import { Request, Response, Router } from "express"

import { Pool } from "../db";
import { Els_Client } from "../els_client"

import { getUserId, getFeedsByCategoryId, getFeed } from "../common"

import * as config from "config"

const els_conf:any = config.get('elasticsearch')

const itemsRouter: Router = Router()

const getItemsByFeedId = async (feed_id: number, user_id: number, all_state: boolean = false) => {
    let sql = 'SELECT i.*, COALESCE(um.status, false) as status FROM item AS i LEFT JOIN useritemmap AS um ON i.id = um.item_id WHERE  i.feed_id = ? AND um.user_id = ?'
    if (!all_state)
	sql = sql + ' AND um.status != true'

    sql += ' ORDER by i.pubdate DESC, i.id DESC';

    return await Pool.query(sql, [feed_id, user_id])
}

const getSearch = async(user_id: number, query:string) => {
    // FIXME:: query のパース

    const result = await Els_Client.search({
	"index": els_conf.index,
	"body": {
	    "query": {
		"multi_match": {
		    "fields": ["title", "content"],
		    "query": query
		}
	    },
	    "size": 1000,
	    "_source" : ["id"]
	}
    })
    let ids = [0];
    for (let i = 0 ; i < result.body.hits.hits.length; i++) {
	ids.push(result.body.hits.hits[i]._source.id)
    }

    let sql = 'SELECT i.*, um.status FROM item AS i JOIN useritemmap AS um ON i.id = um.item_id WHERE i.id IN ('+ids.join(',')+') AND um.user_id = ? ORDER by i.pubdate DESC, i.id DESC'
    console.log(user_id)
    console.log(sql)
    return await Pool.query(sql, [user_id])
}

// fetch items by category_id
itemsRouter.post('/:cat_id([0-9]+)', async (req: Request, resp: Response) => {
    const mode = req.body.mode
    const flatten = !!req.body.flatten
    const cat_id:number = Number(req.params.cat_id)

    let meta = {
	type: 'category',
	mode: mode,
	cat_id: cat_id,
	flatten: flatten,
	count: 0
    }

    const uid = await getUserId(req['user'])
    if (!!!uid) {
	meta['error'] = true
	meta['error_info'] = 'invalid uid'
	return resp.json({meta: meta, content: []})
    }

    let all_state = (mode == 'all')

    const [rows, fields] = await getFeedsByCategoryId(uid, cat_id)
    let ret = []
    for (let i = 0 ; i < rows.length; i++) {
	const [irows, ifields] = await getItemsByFeedId(rows[i]['id'], uid, all_state)
	if (Array.isArray(irows) && irows.length) {
	    meta['count'] += irows.length
	    if (flatten) {
		ret.push({'_head': rows[i]})
		ret = ret.concat(irows)
	    } else {
		ret.push({feed_id: rows[i]['id'], feed_name: rows[i]['name'], web_url: rows[i]['web_url'], items: irows})
	    }
	}
    }

    // adaptive な場合は 未読がない場合は既読も拾い出す
    if (mode == 'adaptive' && !ret.length) {
	for (let i = 0 ; i < rows.length; i++) {
	    const [irows, ifields] = await getItemsByFeedId(rows[i]['id'], uid, true)
	    if (Array.isArray(irows) && irows.length) {
		meta['count'] += irows.length
		if (flatten) {
		    ret.push({'_head': rows[i]})
		    ret = ret.concat(irows)
		} else {
		    ret.push({feed_id: rows[i]['id'], feed_name: rows[i]['name'], web_url: rows[i]['web_url'], items: irows})
		}
	    }
	}
    }

    return resp.json({meta: meta, content: ret})
})

// fetch items by feed_id
itemsRouter.post('/feed/:feed_id([0-9]+)', async (req: Request, resp: Response) => {
    const mode = req.body.mode
    const flatten = !!req.body.flatten
    const feed_id:number = Number(req.params.feed_id)

    let meta = {
	type: 'feed',
	mode: mode,
	feed_id: feed_id,
	flatten: flatten,
	count: 0
    }

    const uid = await getUserId(req['user'])
    if (!!!uid) {
	meta['error'] = true
	meta['error_info'] = 'invalid uid'
	return resp.json({meta: meta, content: []})
    }

    let all_state = (mode == 'all')

    const [frows, ffields] = await getFeed(uid, feed_id)

    let ret = []
    const [irows, ifields] = await getItemsByFeedId(feed_id, uid, all_state)
    if (Array.isArray(irows) && irows.length) {
	meta['count'] = irows.length
	if (flatten) {
	    ret.push({'_head': frows[0]})
	    ret = ret.concat(irows)
	} else {
	    ret = [{feed_id: feed_id, feed_name: frows[0]['name'], items: irows}]
	}
    }
    // adaptive な場合は 未読がない場合は既読も拾い出す
    if (mode == 'adaptive' && !ret.length) {
	const [irows, ifields] = await getItemsByFeedId(feed_id, uid, true)
	if (Array.isArray(irows) && irows.length) {
	    meta['count'] = irows.length
	    if (flatten) {
		ret.push({'_head': frows[0]})
		ret = ret.concat(irows)
	    } else {
		ret = [{feed_id: feed_id, feed_name: frows[0]['name'], items: irows}]
	    }
	}
    }

    return resp.json({meta: meta , content: ret})
})

// fetch items by search word
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

itemsRouter.post('/search', async (req: Request, resp: Response) => {
    const flatten = !!req.body.flatten
    const query:string = req.body.query

    let meta = {
	type: 'search',
	query: query,
	flatten: flatten,
	count: 0
    }

    const uid = await getUserId(req['user'])
    if (!!!uid) {
	meta['error'] = true
	meta['error_info'] = 'invalid uid'
	return resp.json({meta: meta, content: []})
    }

    let ret = []
    const [rows, fields] = await getSearch(uid, query)
    console.log(rows)

    let feed_cache = {}
    if (Array.isArray(rows) && rows.length) {
	meta['count'] = rows.length
	for(let i = 0; i < rows.length ; i++) {
	    if (typeof feed_cache[rows[i]['feed_id']] == 'undefined') {
		const [frows, ffields] = await getFeed(uid, Number(rows[i]['feed_id']))
		if (typeof frows[0]['name'] != 'undefined') {
		    feed_cache[rows[i]['feed_id']] = frows[0]
		}
	    }
	    let feed = feed_cache[rows[i]['feed_id']]

	    if (flatten) {
		ret.push({'_head': feed})
		ret = ret.concat(rows[i])
	    } else {
		ret = ret.concat({feed_id: feed['id'], feed_name: feed['name'], items: rows[i]})
	    }
	}
    }

    return resp.json({meta: meta , content: ret})
})

export { itemsRouter }

import { Request, Response, Router } from "express";

import { Pool } from "../db";
import { getUserId, getCategories } from "../common"

const categoriesRouter: Router = Router()

categoriesRouter.post('/', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const all_state = (!!req.body.all_state)

    const [rows, fields] = await getCategories(uid)
    let ret = []
    for (let i = 0 ; i < rows.length; i++) {
	const cat_id = Number(rows[i]['id']);
	const [rows2, fields2] = await Pool.query('SELECT count(id) as unread FROM useritemmap WHERE status = 0 AND category_id = ?', [cat_id])
	const unread = Number(rows2[0]['unread'])
	if (all_state || unread > 0)
	    ret.push({id: cat_id, name: rows[i]['name'], unread: unread})
    }
    return resp.json(ret)
})

categoriesRouter.post('/simple', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const [rows, fields] = await Pool.query('SELECT id, name FROM category WHERE user_id = ? ORDER BY name', [uid])
    return resp.json(rows)
})

categoriesRouter.post('/:cat_id([0-9]+)', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const [rows, fields] = await Pool.query('SELECT id, name FROM category WHERE user_id = ? AND id = ?', [uid, req.params.cat_id])
    return resp.json(rows[0])
})

categoriesRouter.post('/first', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const [rows, fields] = await Pool.query('SELECT id, name FROM category WHERE user_id = ? ORDER BY id desc LIMIT 1', [uid])
    return resp.json(rows[0])
})

export { categoriesRouter}

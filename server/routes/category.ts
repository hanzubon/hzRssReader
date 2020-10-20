import { Request, Response, Router } from "express";

import { Pool } from "../db";
import { getUserId, moveFeedsToCategory, deleteCategory, updateCategory, checkCategory, getCategory } from "../common"

const categoryRouter: Router = Router()

categoryRouter.post('/delete', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const cat_id:number = Number(req.body.target_cat_id)
    const dest_cat_id = await checkCategory(uid, req)

    if (!!dest_cat_id && dest_cat_id != -2) {
	const mret = await moveFeedsToCategory(uid, cat_id, dest_cat_id)
	if (!!!mret)
	    return resp.json({'status':'error', 'message': 'feed move error'})
    }

    try {
	const dret = await deleteCategory(uid, cat_id)
	if (!!!dret || dret[0].affectedRows != 1)
	    return resp.json({'status':'error', 'message':'not found cat_id='+cat_id})
    } catch (e) {
	console.log(e)
	return resp.json({'status': 'error', 'messsage': 'category delete failed: '+e.code})
    }

    return resp.json({'status':'ok', 'message':'delete category cat_id='+cat_id, 'cat_id': cat_id})
})

categoryRouter.post('/edit', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    const cat_id:number = Number(req.body.cat_id)
    const name = req.body.name

    try {
	const dret = await updateCategory(uid, cat_id, name)
	if (!!!dret || dret[0].affectedRows != 1)
	    return resp.json({'status':'error', 'message':'not found cat_id='+cat_id})
    } catch (e) {
	console.log(e)
	return resp.json({'status': 'error', 'messsage': 'category update failed: '+e.code})
    }

    return resp.json({'status':'ok', 'message':'update category cat_id='+cat_id, 'cat_id': cat_id})
})

categoryRouter.get('/:cat_id([0-9]+)', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid)
	return resp.json({})
    const cat_id:number = Number(req.params.cat_id)

    const [rows, fields] = await getCategory(uid, cat_id)
    if (!!!rows || ! Array.isArray(rows) || !rows.length)
	return resp.json({})

    return resp.json(rows[0])
})


export { categoryRouter}

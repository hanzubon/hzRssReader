import { Request, Response, Router } from "express"

import { Pool } from "../db";
import { getUserId } from "../common"

const itemRouter: Router = Router()

// fetch items by category_id
itemRouter.post('/status', async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json([])

    let ids = req.body.id
    if (!!!ids) return resp.json([])
    if (!Array.isArray(ids)) ids = [ids]
    if (!ids.length) return resp.json([])

    const status = (!!req.body.status)

    const res = await Pool.query('UPDATE useritemmap SET status = ? WHERE item_id IN (?) AND user_id = ?', [status, ids, uid])
    return resp.json({id: ids, status: status, info: res[0]['info'], result: (res[0]['affectedRows'] == 1)})
})

export { itemRouter }

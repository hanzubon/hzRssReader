import { Request, Response, Router } from "express"
import * as multer from 'multer'

import { Pool } from "../db";
import { getUserId, importOpml } from "../common"

const opmlRouter: Router = Router()

const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024}})

opmlRouter.post('/import', upload.single('opml'), async (req: Request, resp: Response) => {
    const uid = await getUserId(req['user'])
    if (!!!uid) return resp.json({'status': 'error', 'message': 'user not found'})

    let ret;
    try {
	ret = await importOpml(uid, req.file.buffer.toString())
    } catch (e) {
	console.log(e)
	// FIXME: exceition ハンドリング
	return resp.json({'status': 'error', 'message': e})
    }

    return resp.json({'status': 'ok', 'message': 'OPML file is imported'})
})

export { opmlRouter }

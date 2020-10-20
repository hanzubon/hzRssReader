import { Request, Response, Router } from "express"

import { versions } from "../versions"
import { getUserId } from "../common"

const versionsRouter: Router = Router();

versionsRouter.get('/', async (request: Request, response: Response) => {
    console.log(request['user'])
    const uid = await getUserId(request['user'])
    console.log(uid)
    let ret = {...versions}
    ret['uid'] = uid
    response.json(ret);
})

export {versionsRouter}

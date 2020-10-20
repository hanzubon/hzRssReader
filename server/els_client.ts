import * as config from "config"
import { Client } from '@elastic/elasticsearch'

const c:any = config.get("elasticsearch");

const Els_Client = new Client(
    { node: c.node }
)

export { Els_Client }

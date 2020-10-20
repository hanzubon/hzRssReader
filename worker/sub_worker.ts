import * as pubSubHubbub from "pubsubhubbub"
import * as config from "config"
import * as mysql from "mysql2/promise"
import { mqutil } from "./mqutil"

const sub_opt = config.get('pubsubhubbub')
const db_conf = config.get('database')
const srv = pubSubHubbub.createServer({callbackUrl: sub_opt['url']})

const pool = mysql.createPool({
    host: db_conf['host'],
    user: db_conf['user'],
    password: db_conf['password'],
    database: db_conf['name'],
    connectionLimit: 100,
    supportBigNumbers: true,
    waitForConnections: true
})

let sub_refresh_int;

srv.on('listen', () => {
    console.log('LISTEN port: '+sub_opt['port'])
    refresh_subscription(true)

    // FIXME:: とりあえず 1分ごとにチェックするようにしてるが
    // なにか設定できるようにしたほうがよさげ
    sub_refresh_int = setInterval(refresh_subscription, 60 * 1000)
})

srv.on('feed', (data) => {
    console.log('FEED')
    console.log(data)
    console.log(data.feed.toString())
    update_feed({'command': 'update_feed', 'topic': data['topic'], feed_data: data.feed.toString()})
})

srv.on('subscribe', (data) => {
    console.log('subscribeed')
    console.log(data)

    const lease = parseInt(!!data['lease'] ? data['lease'] : 0)
    try {
	pool.query('UPDATE hubmap SET subscribed_at = NOW(), lease = ? WHERE feed_id = (select id from feed where url = ?)', [lease, data['topic']])
    } catch (e) {
	console.log(e)
    }
})

const subscribe = (topic, hub) => {
    srv.subscribe(topic, hub, (err, data) => {
	if (err) {
	    console.log('ERROR: subscribe failed for topic='+topic+', hub='+hub+' '+err)
	    return
	}
	console.log('subscribe for topic='+topic+', hub='+hub)
    })
}

const refresh_subscription = async (force = false) => {
    // Note::
    // DBからひいて refresh が必要な subscrition を洗い出して 再度 subscribe する
    // subscribe 情報には 更新した時刻があるので 指定された一定時刻より前に subscribe した
    // ものを拾い出して subscribe() を呼べばいいはず
    const sub_sql = force ? '' :  ' AND lease < UNIX_TIMESTAMP(NOW()) - 3600';
    let rows
    let fields
    try {
	[rows, fields] = await pool.query('SELECT feed.url as topic, hubmap.hub, hubmap.id FROM hubmap, feed WHERE hubmap.feed_id = feed.id'+sub_sql);
	rows.forEach(v => {
	subscribe(v.topic, v.hub)
	});
    } catch(e) {
	console.log(e)
    }
}

const update_feed = async (params) => {
    await mq_u.mqSend(JSON.stringify(params))
}

const refresh_feeds = async () => {
    // Note:: DB から更新が必要なfeedを拾い出す
    const sql = 'SELECT * FROM feed WHERE unix_timestamp(updated_at) + update_interval < UNIX_TIMESTAMP()'
    let rows
    let fields
    try {
       [rows, fields] = await pool.query(sql)
    } catch (e) {
	console.log(e)
    }

    await mq_u.mqInit()

    // Note:: 各 URL ごとに update_feed() を呼ぶ
    rows.forEach(v => {
	console.log('update_feed='+v.url)
	update_feed({'command': 'update_feed', 'topic': v.url, 'id': v.id})
    })
}

let update_int

const mq_u = new mqutil()
try {
    process.title='hzrss-feed-subscribe-worker'
    srv.listen(sub_opt['port'])

    // FIXME:: ここも 60秒ごとの実行にしてあるが なんか設定でかえられるようにしたほうがいいかな
    update_int = setInterval(refresh_feeds, 60 * 1000)
    refresh_feeds()
} catch (e) {
    console.log('unknown error, force stop')
    console.log('unhandled error: name='+e.name+', message='+e.message)
    process.exit(1)
}

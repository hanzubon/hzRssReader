import * as config from "config"
import * as mysql from "mysql2/promise"
import { mqutil } from "./mqutil"
const Parser = require('rss-parser')

const db_conf = config.get('database')

const pool = mysql.createPool({
    host: db_conf['host'],
    user: db_conf['user'],
    password: db_conf['password'],
    database: db_conf['name'],
    connectionLimit: 100,
    supportBigNumbers: true,
    waitForConnections: true
})


// Note: rss-parser はわりと処理が雑 rel=hub が拾えないので link エレメントを
// 全部取り出して 自前で処理することにする
const parser = new Parser({
    customFields: {
	feed: [
	    ['link', 'links', {keepArray: true}],
	    ['atom:link', 'links', {keepArray: true}]
	]
    }
})

let timer_handle

const init_timeout = () => {
    return setTimeout(() => {
        console.log('PING is missing, force restart');
        process.exit(1)
    }, 900 * 1000)
}

const reset_timeout = () => {
    clearTimeout(timer_handle)
    timer_handle = init_timeout()
}

const _log = (msg) => {
    console.log(msg)
}

const _err_log = (msg) => {
    console.log(msg)
}

const update_feed = async (params) => {
    let rows, fields
    if (!!!params['id']) {
	try {
	    [rows, fields] = await pool.query('SELECT id FROM feed WHERE url = ?', [params['topic']])
	} catch(e) {
	    _err_log(e);
	}
	if (!!rows[0])
	    params['id'] = rows[0]['id'];
    }
    _log('update_feed id='+params['id']+', topic='+params['topic'])

    // Note:: rss を fetch して parse して
    let content
    try {
	if (!!params['feed_data']) {
	    content = await parser.parseString(params['feed_data'])
	    _log(content)
	} else {
	    _log('Parse '+params['topic'])
	    content = await parser.parseURL(params['topic'])
	}
    } catch(e) {
	let target
	if (!!params['feed_data']) {
	    target = params['feed_data']
	} else {
	    target = params['topic']
	}
	_err_log('Parser error: '+target)
	_err_log(e)
	await pool.query('INSERT INTO feederror (feed_id, error) VALUES (?, ?)', [params['id'], e.message])
	return
    }

    let html_url;
    if (!!content['links']) {
	content['links'].forEach(v => {
	    if (!!v.$ && !!v.$.rel && v.$.rel == 'alternative' && !!v.$.type && v.$.type == 'text/html') {
		html_url = v.$.href
	    }
	})
    }

    if (!!html_url) {
	try {
	    await pool.query('UPDATE feed set web_url = ? WHERE id = ?', [html_url, params['id']])
	} catch (e) {
	    _err_log(e)
	}
    }

    if (!!content['title']) {
	try {
	    await pool.query('UPDATE feed set name = ? WHERE id = ?', [content['title'], params['id']])
	} catch(e) {
	    _err_log(e)
	}
    }

    // item ないし...
    if (!!!content['items'] || !content['items'].length) {
	_log('No items...')
	return
    }

    // Note:: DB に item をつっこむ
    content['items'].forEach(async (v) => {
	try {
	    const title = !!v['title'] ? v['title'] : ''
	    const content = !!v['contentSnippet'] ? v['contentSnippet'] : (!!v['content'] ? v['content'] : '')
	    const link = !!v['link'] ? v['link'] : ''
	    const guid = !!v['guid'] ? v['guid'] : (!!v['id'] ? v['id'] : link)
	    console.log('link='+link+', guid='+guid)

	    // FIXME
	    // うーん このロジックだと pubdate 相当がない feed (例えば nikkei とか)だと
	    // 毎回更新されてしまう感じなので
	    //  1) pubDate がない場合は 現在の時刻をつっこんでしまおう
	    //  2) pubdate は更新しないようにしよう
	    // pubDateとかdc:date等がある場合には 常に isoDate が定義されるようなので このフィールドを使うほうが安全そう
	    const pubdate = !!v['isoDate'] ? v['isoDate'] : '2000-01-01 00:00:00'
	    const unix_time = Math.floor(Date.parse(pubdate) / 1000)

	    const [item_chk_rows, item_chk_fields] = await pool.query('SELECT id, UNIX_TIMESTAMP(pubdate) as unix_timestamp FROM item WHERE guid = ?', [guid]);
	    if (Array.isArray(item_chk_rows) && item_chk_rows.length) {
		if (item_chk_rows[0]['unix_timestamp'] != unix_time) {
		    _log('UPDATE: '+guid)
		    try {
			await pool.query('UPDATE item SET title = ?, content = ?, link = ?, pubdate = FROM_UNIXTIME(?) WHERE id = ?',
					 [title, content, link, unix_time, item_chk_rows[0]['id']])
		    } catch(e) {
			_err_log(e)
		    }
		} else {
		    _log('NOT UPDATED: '+guid)
		}
	    } else {
		// ない
		_log('NEW: '+guid)
		const ins_res = await pool.query('INSERT INTO item (title, content, link, guid, pubdate, feed_id) VALUES (?,?,?,?,FROM_UNIXTIME(?),?)',
						 [title, content, link, guid, unix_time, params['id']])
		const item_id = ins_res[0]['insertId']
		const feed_id = params['id']
		const [srows, sfields] = await pool.query('SELECT user_id, category_id FROM categorymap WHERE feed_id = ?', [feed_id])
		if (Array.isArray(srows)) {
		    for (let i = 0; i < srows.length; i++) {
			let cat_id = srows[i]['category_id'];
			let user_id = srows[i]['user_id'];
			try {
			    await pool.query('INSERT INTO useritemmap (item_id, feed_id, category_id, user_id) VALUES (?, ?, ?, ?)', [item_id, feed_id, cat_id, user_id]);
			} catch(e) {
			    _err_log(e);
			}
		    }
		}
	    }
	} catch (e) {
	    _err_log(e)
	}
    })

    // Note::
    // feed を更新した時刻を書き込むこと
    try {
	await pool.query('UPDATE feed set updated_at = NOW() WHERE id = ?', [params['id']])
    } catch(e) {
	_err_log(e)
    }

    // Note:: もし pubsubhubbun の情報がある場合、DB に insert しておく(subscribe 自体は
    // sub_worker の refresh_subscription にまかせる
    // なお、事前に確認せずに いきなり insert してるが feed_id に unique 制約がかかってるので
    // 同じエントリをつっこんだときは DUP_ENTRY のエラーになるだけなので問題ない(DUP_ENTRY の
    // エラー exception は無視して ok

    let hub_url
    if (!!content['links']) {
	content['links'].forEach(v => {
	    if (!!v.$ && !!v.$.rel && v.$.rel == 'hub') {
		hub_url = v.$.href
	    }
	})
    }
    if (!hub_url) return

    try {
	const res = await pool.query("INSERT INTO hubmap (hub,feed_id,subscribed_at) VALUES (?, ?, '2000-01-01 00:00:00')", [hub_url, params['id']])
    } catch(e) {
	if (e.code != 'ER_DUP_ENTRY')
	    _err_log(e)
    }

}

const main = async() => {

    const u = new mqutil()
    const channel = await u.mqInit()
    channel.prefetch(1)
    const qname = await u.mqGetQname()

    channel.consume(qname, (message) => {
	try {
            if (message === null) {
		// consume cancel notification
                // とりあえずどうもできんともかく抜ける
		return
	    }
	    // とりあえず なにか受け取ったのでタイマーはリセットする
            reset_timeout()

            let data
            try {
                data = JSON.parse(message.content.toString())
            } catch (e) {
                _err_log('Message parse error force ack')
                channel.ack(message)
            }
            if (!!!data) {
                _err_log('Message parse error force ack')
                channel.ack(message)
            }

	    if (!!data.command && data.command == 'PING') {
		// タイマーをリセットする
		_log('PONG: timer reset')
		reset_timeout()
		channel.ack(message)
		return
            }

            // コマンドが不明 ack しちゃえ
            if (!!!data.command || data.command != 'update_feed') {
		channel.ack(message)
		return
	    }
	    update_feed(data)
	    channel.ack(message)
	    return
	} catch(e) {
	    _err_log(e)
	}
    })
}

try {
    process.title='hzrss-feed-update-worker'
    timer_handle = init_timeout()
    main()
} catch (e) {
    _err_log('unknown error, force stop')
    _err_log('unhandled error: name='+e.name+', message='+e.message)
    process.exit(1)
}

import * as config from "config"
import * as mysql from "mysql2/promise"

const opmlToJSON = require('opml-to-json')

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

// FIXME:: hard coding すんな
const uid = 10

const parse_opml = (input) => {
    return new Promise((resolve,reject) => {
	opmlToJSON(input, (err, json) => {
	    if (err) reject(err)
	    resolve(json)
	})
    })
}

const main = async (input) => {
    const json = await parse_opml(input)

    if (!!! json['children'] || !Array.isArray(json['children']) || !json['children'].length) return
    await parseChildren('', json['children'])
    console.log('FINISH ?')
    await pool.end()
}

const parseChildren = async(cat, children) => {
    if (!!! children|| !Array.isArray(children) || !children.length) return

    // category の登録
    let cat_id
    try {
	// FIXME::
	// カテゴリなしの場合 cat が カラ文字列なので なにかデータ突っ込んどかないと あとあと困りそう
	const [cat_rows] = await pool.query('SELECT id FROM category WHERE name = ?', [cat])
	if (!!cat_rows && cat_rows[0]) {
	    // あった
	    cat_id = cat_rows[0]['id']
	} else {
	    // ないので category を登録する
	    console.log('NOT FOUND category: name='+cat)
	    const ret = await pool.query('INSERT INTO category (user_id, name) VALUES (?, ?)', [uid,cat])
	    cat_id = ret[0]['insertId']
	}
    } catch(e) {
	console.log(e)
	process.exit(1);
    }
    console.log('cat_id',cat_id)

    for (let i = 0; i < children.length; i++) {
	let v = children[i]
	if (!!v['#type'] && v['#type'] == 'feed') {
	    console.log('category='+cat+', url='+v['xmlurl']+', name='+v['text'])
	    // まず url で feed_id を検索する
	    let feed_id
	    try {
		const [feed_rows] = await pool.query('SELECT id FROM feed WHERE url = ?', v['xmlurl'])
		if (!!feed_rows && feed_rows[0]) {
		    //あった
		    console.log('FOUND: url='+v['xmlurl']+', feed_id='+feed_rows[0]['id'])
		    feed_id = feed_rows[0]['id']
		} else {
		    // ないので feed を登録する
		    console.log('NOT FOUND: url='+v['xmlurl'])
		    // FIXME update_interval どうしよう
		    const ret = await pool.query('INSERT INTO feed (url, web_url, update_interval) VALUES (?, ?, 600)',
						 [v['xmlurl'], v['htmlurl']])
		    feed_id = ret[0]['insertId']
		}
	    } catch(e) {
		console.log(e)
		process.exit(1);
	    }
	    console.log('feed_id='+feed_id)
	    // catmap の登録
	    try {
		await pool.query('INSERT INTO categorymap (category_id, feed_id, user_id, feed_label) VALUES (?,?,?,?)',
				 [cat_id, feed_id, uid, v['text']])
	    } catch(e) {
		// 同一ユーザですでに同じfeed_idに対してカテゴリがセットされている場合は
		// unique 制約でエラーになるが 無視する
		if (e.code != 'ER_DUP_ENTRY') {
		    console.log(e)
		    process.exit(1);
		}
	    }
	}
	if (!!v['text'] && v['children']) {
	    await parseChildren(cat.length ? cat+' '+v['text'] : v['text'], v['children'])
	}
    }
}

const input = require('fs').readFileSync('/dev/stdin', 'utf8')
main(input)

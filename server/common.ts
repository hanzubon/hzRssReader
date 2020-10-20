import * as cache from "memory-cache"
import { Pool } from "./db"
import * as config from "config"
import { RowDataPacket, OkPacket } from "mysql2/promise"
import { Request } from "express";

const sys_conf:any = config.get('system')

const user_cache_prefix = '_user:'

const checkCategory = async (uid: number, req: Request) => {
    let cat_id = Number(req.body['cat_id'])

    if (cat_id == -2) return cat_id

    if (cat_id == -1) {
	// カテゴリ新規作成
	const cat_name = req.body['cat_name']
	if (!!!cat_name)
	    throw 'missing category name to create category'
	const cret = await addCategory(uid, cat_name)
	if (!!!cret || cret[0].affectedRows != 1)
	    throw 'DB category insert error'
	cat_id = cret[0].insertId
    } else {
	// 対象のカテゴリがあるか確認
	const [crows, cfields] = await Pool.query('SELECT id FROM category WHERE user_id = ? AND id = ?', [uid, cat_id])
	if (!!!crows || ! Array.isArray(crows) || !crows.length)
	    throw 'invalid category (not found the category id='+cat_id
    }

    return cat_id
}

const createDefaultItems = async (uid: number) => {
    // FIXME:: 処理の大部分が opml_parseChildren() と重複なので整理せよ...
    const [rows, fields] = await Pool.query('SELECT * FROM default_feed ORDER BY id')

    if (!!!rows || !Array.isArray(rows) || !rows.length) return

    let catid_map = {}
    for (let i = 0; i < rows.length; i++) {
	const name = rows[i]['category_name']
	const [cat_rows] = await getCategoryByName(uid, name)
	if (!!cat_rows && cat_rows[0]) {
	    // あった
	    catid_map[name] = cat_rows[0]['id']
	} else {
	    // ないので category を登録する
	    console.log('NOT FOUND category: name='+name)
	    const ret = await addCategory(uid, name)
	    catid_map[name] = ret[0]['insertId']
	}
	const cat_id = catid_map[name]
	console.log('cat_id',cat_id)

	let feed_found = false
	let feed_id = 0
	const url = rows[i]['url']
	const web_url = rows[i]['web_url']
	const [feed_rows] = await Pool.query('SELECT id FROM feed WHERE url = ?', [url])
	if (!!feed_rows && feed_rows[0]) {
	    // あった
	    console.log('FOUND: url='+url+', feed_id='+feed_rows[0]['id'])
	    feed_id = feed_rows[0]['id']
	    feed_found = true
	} else {
	    // ないので feed を登録する
	    console.log('NOT FOUND: url='+url)
	    // FIXME update_interval どうしよう
	    const ret = await Pool.query('INSERT INTO feed (url, web_url, update_interval) VALUES (?, ?, 600)',
					 [url, web_url])
	    feed_id = ret[0]['insertId']
	}
	console.log('feed_id='+feed_id)

	// catmap の登録
	try {
	    await Pool.query('INSERT INTO categorymap (category_id, feed_id, user_id, feed_label) VALUES (?,?,?,?)',
			     [cat_id, feed_id, uid, rows[i]['name']])
	} catch(e) {
	    // 同一ユーザですでに同じfeed_idに対してカテゴリがセットされている場合は
	    // unique 制約でエラーになるが 無視する
	    if (e.code != 'ER_DUP_ENTRY')
		throw e
	}


	// 該当 feed がすでにあった場合は item がある場合があるので
	// useritemmap に登録する
	// item が多いとやたら時間かかることになるので 3日前までにしぼろう
	if (feed_found) {
	    try {
		const [item_rows] = await Pool.query('SELECT id FROM item WHERE feed_id = ? AND pubdate > (NOW() - INTERVAL 3 DAY) ORDER BY id', [feed_id])
		if (!!item_rows && Array.isArray(item_rows) && item_rows.length) {
		    for (let i = 0; i < item_rows.length; i++) {
			await Pool.query('INSERT INTO useritemmap (item_id, feed_id, category_id, user_id) VALUES (?,?,?,?)', [item_rows[i]['id'], feed_id, cat_id, uid])
		    }
		}
	    } catch (e) {
		if (e.code != 'ER_DUP_ENTRY')
		    throw e
	    }
	}
    }
}


const getUserId = async (user: any) => {
    if (!!!user || !!!user['sub']) return 0

    const cache_key = user_cache_prefix+user['sub']
    let uid = cache.get(cache_key)
    if (!!uid) return uid
    console.log('[getUserId] missing on cache: '+user['sub'])
    const [rows, fields] = await Pool.query('SELECT id FROM user WHERE auth0_user_id = ? LIMIT 1', [user['sub']])
    if (!!rows && Array.isArray(rows) && rows.length > 0) {
	// DB 上にユーザあった
	uid = Number(rows[0]['id'])
	cache.put(cache_key, uid)
	return uid
    }
    // ユーザ作成が enable になってなかったら そのまま 0 返す
    if (!!!sys_conf['create_user']) return 0

    const res = await Pool.query('INSERT INTO user (auth0_user_id) VALUES (?)',[user['sub']])
    uid = Number(res[0]['insertId'])
    cache.put(cache_key, uid)
    await createDefaultItems(uid)
    return uid
}

//const getFeedsByCategoryId = async (user_id: number, cat_id: number): Promise<RowDataPacket[]> => {
const getFeedsByCategoryId = async (user_id: number, cat_id: number): Promise<any[]> => {
    return await Pool.query("SELECT f.id as id, COALESCE(cm.feed_label, f.name, 'NO_NAME') as name, f.web_url, f.url as feed_url FROM categorymap as cm, feed as f WHERE cm.feed_id = f.id AND cm.category_id = ? AND cm.user_id = ? AND UNIX_TIMESTAMP(f.updated_at) > 0 ORDER by name, f.id desc", [cat_id, user_id])
}

//const getCategories = async (user_id: number): Promise<RowDataPacket[]> => {
const getCategories = async (user_id: number): Promise<any[]> => {
    return await Pool.query('SELECT id, name FROM category WHERE user_id = ? ORDER BY name', [user_id])
}

const addCategory = async (user_id: number, name: string): Promise<any> => {
    return await Pool.query('INSERT INTO category (user_id, name) VALUES (?,?)', [user_id, name])
}

//const getCategory = async (user_id: number, cat_id: number): Promise<RowDataPacket[]> => {
const getCategory = async (user_id: number, cat_id: number): Promise<any[]> => {
    return await Pool.query('SELECT id, name FROM category WHERE user_id = ? AND id = ? ORDER BY name', [user_id, cat_id])
}

const getCategoryByName = async (user_id: number, name: string): Promise<any[]> => {
    return await Pool.query('SELECT id, name FROM category WHERE user_id = ? AND name = ? ORDER BY id', [user_id, name])
}

const addFeed = async (url: string): Promise<any> => {
    return await Pool.query('INSERT INTO feed (url) VALUES (?)', [url])
}

const getFeed = async(user_id: number, feed_id: number): Promise<any> => {
    return await Pool.query("SELECT f.id as id, COALESCE(cm.feed_label, f.name, 'NO_NAME') as name, f.url, f.web_url FROM categorymap as cm, feed as f WHERE cm.feed_id = f.id AND cm.feed_id = ? AND cm.user_id = ?", [feed_id, user_id])
}

const deleteCategorymap = async (user_id: number, feed_id: number): Promise<any> => {
    return await Pool.query('DELETE FROM categorymap WHERE user_id = ? AND feed_id = ?', [user_id, feed_id])
}

const deleteUseritemmapByFeedId = async (user_id: number, feed_id: number): Promise<any> => {
    return await Pool.query('DELETE FROM useritemmap WHERE user_id = ? AND feed_id = ?', [user_id, feed_id])
}

const updateCategorymap = async (id: number, cat_id: number, name: string): Promise<any> => {
    const feed_label = !!name && name.length ? name : null
    console.log(cat_id)
    return await Pool.query('UPDATE categorymap SET feed_label = ?, category_id = ? WHERE id = ?', [feed_label, cat_id, id])
}

const moveFeedsToCategory = async (user_id: number, source_cat_id: number, dest_cat_id: number): Promise<any> => {

    return await Pool.query('UPDATE categorymap SET category_id = ? WHERE category_id = ? AND user_id = ?',
			    [dest_cat_id, source_cat_id, user_id])
}

const deleteCategory = async (user_id: number, cat_id: number): Promise<any> => {
    return await Pool.query('DELETE FROM category WHERE id = ? AND user_id = ?', [cat_id, user_id])
}

const updateCategory = async (user_id: number, cat_id: number, name: string): Promise<any> => {
    return await Pool.query('UPDATE category set name = ? WHERE id = ? AND user_id = ?', [name, cat_id, user_id])
}

const opmlToJSON = require('opml-to-json')

const parse_opml = (input) => {
    return new Promise((resolve,reject) => {
	opmlToJSON(input, (err, json) => {
	    if (err) reject(err)
	    resolve(json)
	})
    })
}

const opml_parseChildren = async(uid, cat, children) => {
    if (!!! children|| !Array.isArray(children) || !children.length) return

    // category の登録
    let cat_id

    // FIXME::
    // カテゴリなしの場合 cat が カラ文字列なので なにかデータ突っ込んどかないと あとあと困りそう
    const [cat_rows] = await getCategoryByName(uid, cat)
    if (!!cat_rows && cat_rows[0]) {
	// あった
	cat_id = cat_rows[0]['id']
    } else {
	// ないので category を登録する
	console.log('NOT FOUND category: name='+cat)
	const ret = await addCategory(uid, cat)
	cat_id = ret[0]['insertId']
    }

    console.log('cat_id',cat_id)

    for (let i = 0; i < children.length; i++) {
	let v = children[i]
	if (!!v['#type'] && v['#type'] == 'feed') {
	    console.log('category='+cat+', url='+v['xmlurl']+', name='+v['text'])
	    // まず url で feed_id を検索する
	    let feed_id

	    let feed_found = false
	    const [feed_rows] = await Pool.query('SELECT id FROM feed WHERE url = ?', v['xmlurl'])
	    if (!!feed_rows && feed_rows[0]) {
		//あった
		console.log('FOUND: url='+v['xmlurl']+', feed_id='+feed_rows[0]['id'])
		feed_id = feed_rows[0]['id']
		feed_found = true
	    } else {
		// ないので feed を登録する
		console.log('NOT FOUND: url='+v['xmlurl'])
		// FIXME update_interval どうしよう
		const ret = await Pool.query('INSERT INTO feed (url, web_url, update_interval) VALUES (?, ?, 600)',
						 [v['xmlurl'], v['htmlurl']])
		feed_id = ret[0]['insertId']
	    }

	    console.log('feed_id='+feed_id)
	    // catmap の登録
	    try {
		await Pool.query('INSERT INTO categorymap (category_id, feed_id, user_id, feed_label) VALUES (?,?,?,?)',
				 [cat_id, feed_id, uid, v['text']])
	    } catch(e) {
		// 同一ユーザですでに同じfeed_idに対してカテゴリがセットされている場合は
		// unique 制約でエラーになるが 無視する
		if (e.code != 'ER_DUP_ENTRY')
		    throw e
	    }

	    // 該当 feed がすでにあった場合は item がある場合があるので
	    // useritemmap に登録する
	    // item が多いとやたら時間かかることになるので 3日前までにしぼろう
	    if (feed_found) {
		try {
		    const [item_rows] = await Pool.query('SELECT id FROM item WHERE feed_id = ? AND pubdate > (NOW() - INTERVAL 3 DAY) ORDER BY id', [feed_id])
		    if (!!item_rows && Array.isArray(item_rows) && item_rows.length) {
			for (let i = 0; i < item_rows.length; i++) {
			    await Pool.query('INSERT INTO useritemmap (item_id, feed_id, category_id, user_id) VALUES (?,?,?,?)', [item_rows[i]['id'], feed_id, cat_id, uid])
			}
		    }
		} catch (e) {
		    if (e.code != 'ER_DUP_ENTRY')
			throw e
		}
	    }
	}

	if (!!v['text'] && v['children']) {
	    await opml_parseChildren(uid, cat.length ? cat+' '+v['text'] : v['text'], v['children'])
	}
    }
}

const importOpml = async(uid, input) => {
    const json = await parse_opml(input)

    if (!!! json['children'] || !Array.isArray(json['children']) || !json['children'].length) return false
    await opml_parseChildren(uid, '', json['children'])
    console.log('FINISH ?')
    return true
}

export { getUserId, getFeedsByCategoryId, getCategories, addCategory, addFeed, deleteCategorymap, updateCategorymap, moveFeedsToCategory, deleteCategory, updateCategory, checkCategory, importOpml, getFeed, getCategory, deleteUseritemmapByFeedId }

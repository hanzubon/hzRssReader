import amqp = require('amqplib');
import * as config from "config"

const mq_opt = config.get('mq')

// FIXME エラーハンドリング...

export class mqutil {
    private conn
    private channel

    public mqGetQname = () => {
	return mq_opt['queue']
    }

    public mqGetConnect = async() => {
	if (!!this.conn) return this.conn

	let conn = null
	for (let i = 0; i < mq_opt['servers'].length; i++) {
	    try {
		conn = await amqp.connect(mq_opt['servers'][i])
		if (!!!conn) continue;
		this.conn = conn
		break
	    } catch (e) {
		// ignore
	    }
	}

	if (!!!conn) throw 'Can not connect servers'

	this.conn.on('close', () => {
	    console.log('connection closed, exit')
	    process.exit(0)
	})

	this.conn.on('error', (err) => {
	    console.log('connection error, exit')
	    console.log(err)
	    process.exit(0)
	})

	return this.conn
    }

    public mqGetChannel = async() => {
	// only support single channel
	if (!!this.channel) return this.channel
	const conn = await this.mqGetConnect()
	this.channel = conn.createChannel()
	return this.channel
    }

    public mqAssertQueue = async() => {
	const ch = await this.mqGetChannel()
	const q = await this.mqGetQname()

	await ch.assertQueue(q, {'durable': true})
    }

    public mqInit = async() => {
	await this.mqGetConnect()
	await this.mqAssertQueue()
	return await this.mqGetChannel()
    }

    public mqSend = async(text:string, finish_after_send:boolean = false) => {
	const qname = await this.mqGetQname()
	const ch = await this.mqGetChannel()
	await ch.sendToQueue(qname, new Buffer(text), {presistent: true})
	if (finish_after_send) await this.mqClose()
    }

    public mqClose = async() => {
	if (!!this.channel) {
	    const ch = await this.mqGetChannel()
	    await ch.close()
	}
	if (!!this.conn) {
	    const conn = await this.mqGetConnect()
	    await conn.close()
	}
    }

    public mqAck = async (message) => {
	const ch = await this.mqGetChannel()
	ch.ack(message)
    }

    public mqNack = async (message) => {
	const ch = await this.mqGetChannel()
	ch.nack(message)
    }
}

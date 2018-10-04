const Bot = require('./Bot')
const crypto = require('crypto')
const extend = require('xtend')
const { BotCongfigError } = require('./Errors')

const SIGNATURE_HEADER = 'x-line-signature'
const validateSignature = (req, channelSecret) => {
    if (!req.headers[SIGNATURE_HEADER]) return false
    let { rawBody } = req
    let signature = crypto
        .createHmac('sha256', channelSecret)
        .update(rawBody).digest('base64')

    if (req.headers[SIGNATURE_HEADER] === signature) return true
    else {
        return false
    }
}

class LineBot extends Bot {
    constructor(config) {
        let { accessToken, channelSecret, webhook, ...botConfig } = config
        if (typeof accessToken !== 'string') {
            throw new BotCongfigError(`accessToken format error. Type: ${typeof accessToken}`)
        }
        if (typeof channelSecret !== 'string') {
            throw new BotCongfigError(`channelSecret format error. Type: ${typeof channelSecret}`)
        }
        if (typeof webhook !== 'string') {
            throw new BotCongfigError(`webhook url format error. Type: ${typeof webhook}`)
        }

        super(botConfig)
        this.accessToken = accessToken
        this.channelSecret = channelSecret

        this._fastify.addHook('onRequest', (req, res, next) => {
            let body = []
            req
                .on('data', chunk => body.push(chunk))
                .on('end', () => {
                    body = Buffer.concat(body).toString()
                    req.body = body
                })

            next()
        })

        this._fastify.addHook('preHandler', (request, reply, next) => {
            request.rawBody = request.raw.body
            if (!validateSignature(request, channelSecret)) {
                reply.code(403)
            }
            next()
        })

        this.messager = require('line-messager')({
            accessToken: this.accessToken
        })

        this._fastify.post(webhook, async (req, reply) => {
            this.emit('message', extend({
                body: req.body,
                call: this.call,
                send: this.send,
                onEvent: this.onEvent,
            }, this.messager))
            return { success: true }
        })
    }
}

module.exports = LineBot
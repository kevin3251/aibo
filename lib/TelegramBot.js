const Bot = require('./Bot')
const extend = require('xtend')
const { BotCongfigError } = require('./Errors')
const request = require('request-promise-native')
const BASE_API = 'https://api.telegram.org/bot'

class TelegramBot extends Bot {
    constructor(config) {
        let { botToken, webhook, ...botConfig } = config
        let type = typeof botToken
        if (type !== 'string') {
            throw new BotCongfigError(`botToken format error. Type: ${type}`)
        }
        if (!webhook) {
            throw new BotCongfigError(`no setting webhook url.`)
        }

        super(botConfig)
        this.botToken = botToken
        this.messager = require('telegram-messager')({
            botToken
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

        process.on('exit', this.deleteWebhook)
    }

    setWebHook(url) {
        url = `${BASE_API}${this.botToken}/setWebhook?url=${url}`

        let option = {
            method: 'POST',
            uri: url,
            json: true
        }
        return request(option)
    }


    deleteWebhook() {
        let uri = `${BASE_API}${this.botToken}/deleteWebhook`
        let option = { method: 'GET', uri, json: true }
        return request(option)
    }

    getWebhookInfo() {
        let uri = `${BASE_API}${this.botToken}/getWebhookInfo`
        let option = { method: 'GET', uri, json: true }
        return request(option)
    }
}

module.exports = TelegramBot
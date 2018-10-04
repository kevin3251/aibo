const fastify = require('fastify')
const { EventEmitter } = require('events')
const mUtil = require('./moteUtil')
const extend = require('xtend')

class BaseError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = (new Error(message)).stack
        }
    }
}

class BotCongfigError extends BaseError { }
class MoteChatError extends BaseError { }

/*
    motechat setup for bot class
*/
const setup = async ({ AppName, AppKey, DCenter, EiToken, SToken } = {}) => {
    let settings
    let isOpen = await mUtil.open({ AppName, AppKey, DCenter })
    if (!isOpen) {
        throw new MoteChatError(`motechat not open.`)
    }

    let regData = await mUtil.reg({ EiToken, SToken })
    if (regData.ErrCode != 0) {
        throw new MoteChatError(`reg fail. ${JSON.stringify(regData)}`)
    }

    return regData.result
}

class Hook {
    constructor(option, logger = false) {
        let { key, cert } = option
        // if (!key || typeof key !== 'string') {
        //     throw new BotCongfigError(`SSL certificate key format error. Type: ${typeof key}`)
        // }

        // if (!cert || typeof cert !== 'string') {
        //     throw new BotCongfigError(`SSL certificate key format error. Type: ${typeof cert}`)
        // }

        let server = fastify({
            ignoreTrailingSlash: true,
            // logger,
            logger: {
                prettyPrint: {
                    colorize: true,
                    crlf: false,
                    translateTime: true
                }
            }
            //https: option
        })

        this._fastify = server
        this.logger = this._fastify.log
    }
}

let hasBotInstance = false
class Bot extends Hook {
    constructor({
        // motechat essential settings
        AppName, AppKey, DCenter, EiToken = '', SToken = '',
        // motechat optional settings
        EiOwner, EiName, EiType, EiTag, EiLoc,
        // SSL certificate
        key, cert
    } = {}) {
        if (hasBotInstance) {
            throw new BotCongfigError(`Only create one bot.`)
        }

        super({ key, cert })
        let emitter = new EventEmitter
        this.on = emitter.on
        this.emit = emitter.emit
        let bot = this
        bot.call = mUtil.call
        bot.send = mUtil.send
        bot.onEvent = mUtil.onEvent

        if (!AppName || typeof AppName !== 'string') {
            throw new BotCongfigError(`AppName format error. Type: ${typeof AppName}`)
        }

        if (!AppKey || typeof AppKey !== 'string') {
            throw new BotCongfigError(`AppKey format error. Type: ${typeof AppKey}`)
        }

        if (!DCenter || typeof DCenter !== 'string') {
            throw new BotCongfigError(`DCenter format error. Type: ${typeof DCenter}`)
        }

        if (EiToken ^ SToken) {
            throw new BotCongfigError(
                `SToken, EiToken not match.
                SToken: ${SToken}
                EiToken: ${EiToken}`
            )
        }

        if (EiToken || typeof EiToken !== 'string') {
            throw new BotCongfigError(`EiToken format error. Type: ${typeof EiToken}`)
        }

        if (SToken || typeof SToken !== 'string') {
            throw new BotCongfigError(`SToken format error. Type: ${typeof SToken}`)
        }

        setup({ AppName, AppKey, DCenter, EiToken, SToken }).then(async result => {
            let info = {
                SToken: result.SToken,
                owner: EiOwner,
                name: EiName,
                type: EiType || '.bot',
                tag: EiTag,
                loc: EiLoc
            }
            let finalInfo = await mUtil.setInfo(info)
            bot.motechat = { result, ...{ finalInfo } }
        })
    }

    setWebHook(url, context = {
        call: this.call,
        send: this.send,
        onEvent: this.onEvent,
    }) {
        this._fastify.post(url, async (request, reply) => {
            context = extend(context, { body: request.body })
            this.emit('message', context)
            return { success: true }
        })
    }

    start(port) {
        this._fastify.listen(port)
    }
}

module.exports = Bot
'use strict'
const mchat = require('motechat')
class MoteChatError extends Error {
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

const moteUtil = {
    open(config) {
        return new Promise(resolve => {
            mchat.Open(config, result => resolve(result.ErrCode == 0))
        })
    },

    reg({ EiToken = '', SToken = '' } = {}) {
        return new Promise(resolve => {
            mchat.Reg({ EiToken, SToken }, result => resolve(result))
        })
    },

    setInfo({ SToken, owner, name, type, tag, loc } = {}) {
        if (!SToken || typeof SToken !== 'string') {
            throw new MoteChatError('SToken format error.')
        }
        let env = process.env
        let defaultValue = env.HOSTNAME || env.HOST || env.USER || env.USERNAME
        let info = {
            EiOwner: owner || defaultValue,
            EiName: name || defaultValue,
            EiType: type || '',
            EiTag: tag || '',
            EiLoc: loc || ''
        }

        return new Promise(resolve => {
            let data = { SToken, EdgeInfo: info }
            mchat.Set(data, result => resolve(result))
        })
    },

    send({
        SToken, From, Target, Data,
        SendTimeout = 6,
        WaitReply = 12
    } = {}) {
        if (!SToken || typeof SToken !== 'string') {
            throw new MoteChatError('SToken format error.')
        }

        if (!Target || typeof Target !== 'string') {
            throw new MoteChatError('Target format error.')
        }

        Data = (typeof Data === 'object') ? { ...Data } : { Data }
        return new Promise(resolve => {
            mchat.Send({ SToken, From, Target, Data, SendTimeout, WaitReply }, reply => resolve(reply))
        })
    },

    getInfo({ SToken } = {}) {
        if (!SToken || typeof SToken !== 'string') {
            throw new MoteChatError('SToken format error.')
        }

        return new Promise(resolve => {
            mchat.Get({ SToken }, result => resolve(result))
        })
    },

    call({
        SToken, Target, Func, Data,
        SendTimeout = 6,
        WaitReply = 12
    } = {}) {
        if (!SToken || typeof SToken !== 'string') {
            throw new MoteChatError('SToken format error.')
        }

        if (!Target || typeof Target !== 'string') {
            throw new MoteChatError('Target format error.')
        }

        if (!Func || typeof Func !== 'string') {
            throw new MoteChatError('Func format error')
        }

        Data = (typeof Data === 'object') ? { ...Data } : { Data }
        return new Promise(resolve => {
            mchat.Call({
                SToken, Target, Func, Data, SendTimeout, WaitReply
            }, reply => resolve(reply))
        })
    },

    onEvent: mchat.OnEvent
}

module.exports = moteUtil
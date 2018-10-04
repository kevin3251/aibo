const Bot = require('../lib/LineBot')
const accessToken = 'uybkpwHFWOV09GYXrW5k/cZY784Ah0VsAdVG8tLrY/BFJknaoQ5RI5ZXLtdhS8pKDecx7p4UHtt/33o7n4ZmEGmPjvxTZyJ40GGNaCeabhiV7vL8LBhkp+Ni7yhfxj+dD0rY2WRlZzlaDWrJLuhyHgdB04t89/1O/w1cDnyilFU='
const instance = new Bot({
    AppName: 'moteUtilUnitTest',
    AppKey: '1u6WauSf',
    DCenter: 'dc@202.153.173.253:6780',
    accessToken: accessToken,
    channelSecret: 'f78457c5c60e40a62ff2037021ba468e',
    webhook: '/'
})

instance._fastify.get('/', async (request, reply) => {
    return { success: true }
})

instance.on('message', async ctx => {
    let { events } = ctx.body
    let { id, ...message } = events[0].message
    let { replyToken } = events[0]
    let { userId } = events[0].source
    instance.logger.info(events)
    let { type } = message
    if (type === 'sticker') {
        return await ctx.replyMessage(replyToken, {
            type: 'sticker',
            packageId: '2',
            stickerId: '144'
        })
    }
    // let profile = await context.getProfile(userId)
    // instance.logger.info('profile', profile)
    await ctx.replyMessage(replyToken, message)
})
instance.start(3000)


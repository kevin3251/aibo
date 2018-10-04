const Bot = require('../lib/TelegramBot')
const BOT_TOKEN = '509607219:AAHE9O-79gFdpNRLxbXJf2nsTpm075yMdAU'
const instance = new Bot({
    AppName: 'moteUtilUnitTest',
    AppKey: '1u6WauSf',
    DCenter: 'dc@202.153.173.253:6780',
    botToken: BOT_TOKEN,
    webhook: `/${BOT_TOKEN}`
})

instance.start(3000)
instance.setWebHook(`https://51b3307b.ngrok.io/${BOT_TOKEN}`)
    .then(response => console.log(response))

instance.on('message', async ctx => {
    instance.logger.info(ctx.body)
    const  chatId = ctx.body.message.chat.id
    instance.logger.info(await ctx.getChat(chatId))
})

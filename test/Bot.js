const Bot = require('../lib/Bot')
const logger = require('../lib/logger')
const instance = new Bot({
    AppName: 'moteUtilUnitTest',
    AppKey: '1u6WauSf',
    DCenter: 'dc@202.153.173.253:6780',
    key: '',
    cert: ''
})

console.log(instance)
module.exports = instance
const Bot = require('../lib/LineBot')
const UID = 'U25ebd71431c53f8e6b2baeedd2419bd3'
const accessToken = 'uybkpwHFWOV09GYXrW5k/cZY784Ah0VsAdVG8tLrY/BFJknaoQ5RI5ZXLtdhS8pKDecx7p4UHtt/33o7n4ZmEGmPjvxTZyJ40GGNaCeabhiV7vL8LBhkp+Ni7yhfxj+dD0rY2WRlZzlaDWrJLuhyHgdB04t89/1O/w1cDnyilFU='

// const {
//     getText
// } = require('../lib/LineUtil')

// let message = ['hello', 'bot'].map(getText)
// let { pushMessage } = Bot
// pushMessage(accessToken, UID, message)
//     .then(value => console.log(value))
//     .catch(err => console.log(err))

const request = require('request-promise-native')
const BASE_API = 'https://api.line.me/v2/bot'

let reqTest = async (body) => {
    let options = {
        method: 'POST',
        uri: `${BASE_API}/message/push`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body,
        json: true
    }
    console.log(options)
    return request(options)
}

reqTest({
    "to": "U25ebd71431c53f8e6b2baeedd2419bd3",
    "messages":
    //[
    {
        "type": "text",
        "text": "Hello, world1"
    }//,
    // {
    //     "type": "text",
    //     "text": "Hello, world2"
    // }
    // ]
}).then(value => console.log(value))
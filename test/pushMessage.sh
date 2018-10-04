curl -v -X POST https://api.line.me/v2/bot/message/push \
-H 'Content-Type:application/json' \
-H 'Authorization: Bearer uybkpwHFWOV09GYXrW5k/cZY784Ah0VsAdVG8tLrY/BFJknaoQ5RI5ZXLtdhS8pKDecx7p4UHtt/33o7n4ZmEGmPjvxTZyJ40GGNaCeabhiV7vL8LBhkp+Ni7yhfxj+dD0rY2WRlZzlaDWrJLuhyHgdB04t89/1O/w1cDnyilFU=' \
-d '{
    "to": "U25ebd71431c53f8e6b2baeedd2419bd3",
    "messages":[
        {
            "type":"text",
            "text":"Hello, world1"
        },
        {
            "type":"text",
            "text":"Hello, world2"
        }
    ]
}'
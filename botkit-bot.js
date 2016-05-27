/**
 * Created by Harshil on 5/25/2016.
 */
var botkit = require('botkit');

var accessToken = process.env.FACEBOOK_PAGE_ACCES_TOKEN;
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
var port = process.env.PORT;

if(!accessToken)    throw new Error('FACEBOOK_PAGE_ACCES_TOKEN is required but missing');
if(!verifyToken)    throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing');
if(!port)    throw new Error('PORT is required but missing');

var controller = botkit.facebookbot({
    access_token: accessToken,
    verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
    if(err) return console.log(err)
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('Ready Player 1')
    })
})

bot.hears(['hello', 'hi'], 'message_received', function (bot, message) {
    bot.reply(message, 'Hello!')
    bot.reply(message, 'I want to  show you something')
    bot.reply(message, {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'button',
                text: 'Which do you prefer',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Cats',
                        payload: 'show_cat'
                    },
                    {
                        type: 'postback',
                        title: 'Dogs',
                        payload: 'show_dog'
                    }
                ]
            }
        }
    })
})

controller.on('facebook_postback', function (bot, message) {
    switch (message.payload){
        case 'show_cat':
            bot.reply(message, {
                attachment: {
                    type: 'image',
                    payload: {
                        url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQxmzij2q_8yWnJqPwZ8JR-9SuTrgOCEo6mgFQ3_BaJm55GAUSV'
                    }
                }
            })
            break
        case 'show_dog':
            bot.reply(message, {
                attachment: {
                    type: 'image',
                    payload: {
                        url: 'data:image/jpeg;base64,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'
                    }
                }
            })
            break
    }
})
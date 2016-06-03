/**
 * Created by Harshil on 6/1/2016.
 */
var Botkit = require('botkit');

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
var port = process.env.PORT;

if(!accessToken)    throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but not present');
if(!verifyToken)    throw new Error('FACEBOOK_VERIFY_TOKEN is required but not present');
if(!port)    throw new Error('PORT is required but not present');

var controller = Botkit.facebookbot({
    access_token: accessToken,
    verify_token: verifyToken
});

var bot = controller.spawn();

controller.setupWebserver(port, function (err, webserver) {
    if(err) return console.log(err);
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("Webhooks successfully set up");
    });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, "Welcome to WorkoutTime...");
});

controller.hears(['hi', 'hello', 'hey'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (response, convo) {
        convo.say("Hey there!");
        convo.say("Welcome to WorkoutTime");
        convo.say("I'll help you track your workout");
        convo.say("Just hit me with the details...");
        askFlavor(response, convo);
        convo.next();
    })
});


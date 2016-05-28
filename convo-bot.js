/**
 * Created by Harshil on 5/28/2016.
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
    controller.setupWebhookEndoints(webserver, bot, function () {
        console.log("Webhooks successfully set up");
    });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, "Welcome to Pizzatime...");
});

controller.hears(['pizzatime', 'hi', 'hello'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (response, convo) {
        bot.say("Hey there!");
        bot.say("Welcome to pizzatime");
        bot.say("Let's get you a pizza");
        askFlavor();
        convo.next();
    })
});

askFlavor = function (response, convo) {
    convo.ask("What flavor of pizza do you want?", function (response, convo) {
        convo.say("Awesome");
        askSize();
        convo.next();
    });
};

askSize = function (response, convo) {
    convo.ask("What size do you want?", function (response, convo) {
        convo.say("Sure");
        askWhereDeliver();
        convo.next();
    });
};

askSize = function (response, convo) {
    convo.ask("What size do you want?", function (response, convo) {
        convo.say("Sure");
        askWhereDeliver();
        convo.next();
    });
};

askWhereDeliver = function (response, convo) {
    convo.ask("So where do you want it delivered?", function (response, convo) {
        convo.say("Ok, your order has been placed..");
        convo.say("Goodbye!");
        convo.next();
    });
};


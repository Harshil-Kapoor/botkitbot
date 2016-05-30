/**
 * Created by Harshil on 5/30/2016.
 */
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
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("Webhooks successfully set up");
    });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, "Welcome to Pizzatime...");
});

controller.hears(['pizzatime', 'hi', 'hello'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (response, convo) {
        convo.say("Hey there!");
        convo.say("Welcome to pizzatime");
        convo.say("Let's get you a pizza");
        askFlavor(response, convo);
        convo.next();
    })
});

// convo.ask("What flavor do you want" , function (response, convo) {
// text: 'What flavor of pizza do you want?',

askFlavor = function (response, convo) {
    convo.say("What flavor do you want");
    convo.ask({
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Double Cheese',
                        item_url: 'postback',
                        image_url: 'http://top-10-list.org/wp-content/uploads/2011/05/1_pizza.jpg',
                        subtitle: 'This is a very popular veg. pizza which has a double thick layer of cheese.',
                        payload: 'dC'
                        // buttons: [
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B1'
                        //     },
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B2'
                        //     }
                        // ]
                    },
                    {
                        title: 'Gourmet',
                        item_url: 'postback',
                        image_url: 'http://top-10-list.org/wp-content/uploads/2011/05/2_pizza.jpg',
                        subtitle: 'This is a unique flavour of vegetarian pizza where the pizza where the spicy vegetarian delight is topped with extremely appealing golden corns, loaded with extra cheese.',
                        payload: 'g'
                        // buttons: [
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B1'
                        //     },
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B2'
                        //     }
                        // ]
                    },
                    {
                        title: 'Mexican Green Wave',
                        item_url: 'postback',
                        image_url: 'http://top-10-list.org/wp-content/uploads/2011/05/3_pizza.jpg',
                        subtitle: 'This is another unique recipe of American pizza which mane is influenced by the Mexican Waves.',
                        payload: 'mG'
                        // buttons: [
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B1'
                        //     },
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B2'
                        //     }
                        // ]
                    },
                    {
                        title: 'Peppy Paneer',
                        item_url: 'postback',
                        image_url: 'http://top-10-list.org/wp-content/uploads/2011/05/4_pizza.jpg',
                        subtitle: 'The Paneer used in this pizza are barbequed and then few pieces of Paneer is sprinkled over the pizza along with crispy capsicum slices and spicy red pepper.',
                        payload: 'pP'
                        // buttons: [
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B1'
                        //     },
                        //     {
                        //         type: 'web_url',
                        //         url: 'http://top-10-list.org/2011/05/20/top-10-pizza-flavours/?utm_source=wordtwit&utm_medium=social&utm_campaign=wordtwit',
                        //         title: 'B2'
                        //     }
                        // ]
                    }
                ]
            }
        }
    } , function (response, convo) {
        convo.say("Awesome");
        askSize(response, convo);
        convo.next();
    });
};

// text: "What size do you want?",

askSize = function (response, convo) {
    convo.say("What size do you want?");
    convo.ask({
        attachment: {
            type: 'image',
            payload: {
                url: 'http://www.godfathers.com/sites/default/files/pie_sizes.gif'
            }
        }
    } , function (response, convo) {
        convo.say("Sure");
        askWhereDeliver(response, convo);
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

controller.on('facebook_postback', function (convo, message) {
    switch (message.payload){
        case 'dC' :
            convo.say("Double Cheese it is...");
            break;
        case 'g' :
            convo.say("Gourmet it is...");
            break;
        case 'mG' :
            convo.say("Mexican Green Wave it is...");
            break;
        case 'pP' :
            convo.say("Peppy Paneer it is...");
            break;
    }
});
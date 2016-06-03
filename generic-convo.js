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

var flavor, size, delivery;
var flavorO, sizeO, deliveryO;

var doubleCheese = {
    name: 'Double Cheese',
    img_url: 'http://top-10-list.org/wp-content/uploads/2011/05/1_pizza.jpg',
    info: 'This is a very popular veg. pizza which has a double thick layer of cheese.'
};
var gourmet = {
    name: 'Gourmet',
    img_url: 'http://top-10-list.org/wp-content/uploads/2011/05/2_pizza.jpg',
    info: 'This is a unique flavour of vegetarian pizza where the pizza where the spicy vegetarian delight is topped with extremely appealing golden corns, loaded with extra cheese.',
};
var mexican = {
    name: 'Mexican Green Wave',
    img_url: 'http://top-10-list.org/wp-content/uploads/2011/05/3_pizza.jpg',
    info: 'This is another unique recipe of American pizza which mane is influenced by the Mexican Waves.',
};
var peppyPaneer = {
    name: 'Peppy Paneer',
    img_url: 'http://top-10-list.org/wp-content/uploads/2011/05/4_pizza.jpg',
    info: 'The Paneer used in this pizza are barbequed and then few pieces of Paneer is sprinkled over the pizza along with crispy capsicum slices and spicy red pepper.',
};


var flavorResponse={
    key: 'flavorResp',
    multiple: false
};

var sizeResponse={
    key: 'sizeResp',
    multiple: false
};

var deliveryResponse={
    key: 'deliveryResp',
    multiple: false
};

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

controller.hears(['pizzatime', 'hi', 'hello', 'previous order', 'history'], ['message_received'], function (bot, message) {
    var request = message.match[0];
    console.log("Request captured, request : "+request);
    if(request === 'pizzatime' || request === 'hi' || request === 'hello') {
        bot.startConversation(message, function (response, convo) {
            convo.say("Hey there!");
            convo.say("Welcome to pizzatime");
            convo.say("Let's get you a pizza");
            askFlavor(response, convo);
            convo.next();
        })
    }else if(request === 'previous order' || request === 'history') {
        bot.reply("Sure, here's your previous order :");

        bot.reply("Flavor : " + flavorO);
        bot.reply("Size : " + sizeO);
        bot.reply("Dellivery location : " + deliveryO);
    }
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
                        title: doubleCheese.name,
                        image_url: doubleCheese.img_url,
                        subtitle: doubleCheese.info,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'This one!',
                                payload: 'dC'
                            }
                        ]
                    },
                    {
                        title: gourmet.name,
                        image_url: gourmet.img_url,
                        subtitle: gourmet.info,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'This one!',
                                payload: 'g'
                            }
                        ]
                    },
                    {
                        title: mexican.name,
                        image_url: mexican.img_url,
                        subtitle: mexican.info,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'This one!',
                                payload: 'mG'
                            }
                        ]
                    },
                    {
                        title: peppyPaneer.name,
                        image_url: peppyPaneer.img_url,
                        subtitle: peppyPaneer.info,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'This one!',
                                payload: 'pP'
                            }
                        ]
                    }
                ]
            }
        }
    } , function (response, convo){
        convo.say("Awesome");
        // convo.say("("+flavor+")");
        askSize(response, convo);
        convo.next();
    }, flavorResponse);
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
        size = response.text;
        convo.say("Sure");
        // convo.say("("+size+")");
        askWhereDeliver(response, convo);
        convo.next();
    }, sizeResponse);
};

askWhereDeliver = function (response, convo) {
    convo.ask("So where do you want it delivered?", function (response, convo) {
        delivery = response.text;
        // convo.say("("+delivery+")");
        // convo.say("Ok, do you want to confirm this order?");
        convo.say("Ok!, your order has been placed");
        // convo.say("Goodbye!");

        convo.say("Ok!, your order has been placed");
        // convo.say("Here's your order :");
        // convo.say(convo.extractResponses('flavorResp'));


        // receipt(bot, message);
    //     convo.ask({
    //         attachment:{
    //             type: 'template',
    //             payload:{
    //                 template_type: 'receipt',
    //                 recipient_name: 'Harshil',
    //                 order_number: '123456789',
    //                 currency: 'INR',
    //                 payment_method: 'Cash On Delivery',
    //                 elements: [
    //                     {
    //                         title: "Pizza",
    //                         subtitle: 'Size',
    //                         price: 100,
    //                         image_url: 'http://top-10-list.org/wp-content/uploads/2011/05/1_pizza.jpg'
    //                     }
    //                     // {
    //                     //     title: flavor + " Pizza",
    //                     //     subtitle: 'Size : ' + size,
    //                     //     price: 100,
    //                     //     image_url: getUrl(flavor).toString()
    //                     // }
    //                 ]
    //             }
    //         }
    //     }, [
    //         {
    //             pattern: bot.utterances.yes,
    //             callback: function (response, convo) {
    //                 convo.say("Hey!, your order has been successfully placed...");
    //                 convo.next();
    //             }
    //         },
    //         {
    //             pattern: bot.utterances.no,
    //             callback: function (response, convo) {
    //                 convo.ask("Ok, do you want to order another pizza?", [
    //                     {
    //                         pattern: bot.utterances.yes,
    //                         callback: function (response, convo) {
    //                             convo.say("Let's start again...");
    //                             askFlavor();
    //                             convo.next();
    //                         }
    //                     },
    //                     {
    //                         pattern: bot.utterances.no,
    //                         callback: function (response, convo) {
    //                             convo.say("Okay, hope we'll talk again");
    //                             convo.say("Goodbye!");
    //                             convo.next();
    //                         }
    //                     }
    //                 ]);
    //                 convo.next();
    //             }
    //         }
    //     ]);
        askAnother(response, convo);
        convo.next();
    }, deliveryResponse);
};

askAnother = function (response, convo) {
    convo.ask("Do you want another one?", [
        {
            pattern: bot.utterances.yes,
            callback: function (response, convo) {
                convo.say("Sure! Let's get you another one...");
                askFlavor(response, convo);
                convo.next();
            }
        },
        {
            pattern: bot.utterances.no,
            callback: function (response, convo) {
                convo.say("Perhaps later...");
                // convo.say("Goodbye!");
                // var value = convo.extractResponses();
                // console.log(value.toString());
                // convo.say(value.toString());

                // convo.say(convo.extractResponse('flavorResp'));
                // convo.say(convo.extractResponse('flavorResp'));
                // convo.say(convo.extractResponse('flavorResp'));

                orderDetails(response, convo);
                convo.next();
            }
        },
        {
            default: true,
            callback: function (response, convo) {
                convo.say("Sorry, i didn't get you...");
                convo.repeat();
                convo.next();
            }
        }
    ]);

    convo.on('end', function (convo) {
        var values = convo.extractResponses();
        console.log(values.flavorResponse);
    });

    // convo.on('end', function (convo) {
    //     // convo.say();
    //     convo.say({
    //         attachment:{
    //             type: 'template',
    //             payload:{
    //                 template_type: 'receipt',
    //                 recipient_name: 'Harshil',
    //                 order_number: '123456789',
    //                 currency: 'INR',
    //                 payment_method: 'Cash On Delivery',
    //                 elements: [
    //                     {
    //                         title: flavor + " Pizza",
    //                         quantity: 1,
    //                         price: 50,
    //                         subtitle: 'Size : ' + size,
    //                         image_url: getUrl(flavor).toSource()
    //                     }
    //                 ]
    //             }
    //         }
    //     });
    // })
};

orderDetails = function (response, convo) {
    convo.say("Here's your order details : ");

    if(!flavorO)    flavorO = convo.extractResponse('flavorResp');
    if(!sizeO)      sizeO = convo.extractResponse('sizeResp');
    if(!deliveryO)  deliveryO= convo.extractResponse('deliveryResp');

    convo.say(flavorO);
    convo.say(sizeO);
    convo.say(deliveryO);

};

controller.on('facebook_postback', function (bot, message) {
    switch (message.payload){
        case 'dC' :
            // convo.say("Double Cheese it is...");
            flavor = "Double Cheese";
            bot.reply(message, "Double Cheese it is...");
            break;
        case 'g' :
            // convo.say("Gourmet it is...");
            flavor = "Gourmet";
            bot.reply(message, "Gourmet it is...");
            break;
        case 'mG' :
            // convo.say("Mexican Green Wave it is...");
            flavor = "Mexican Green Wave";
            bot.reply(message, "Mexican Green Wave it is...");
            break;
        case 'pP' :
            flavor = "Peppy Paneer";
            // convo.say("Peppy Paneer it is...");
            bot.reply(message, "Peppy Paneer it is...");
            break;
    }
});

getUrl = function (flavor) {
    switch (flavor) {
        case doubleCheese.name :
            return doubleCheese.img_url;
            break;
        case gourmet.name :
            return gourmet.img_url;
            break;
        case mexican.name :
            return mexican.img_url;
            break;
        case peppyPaneer.name :
            return peppyPaneer.img_url;
            break;
    }
};

// receipt = function (bot, message) {
//     bot.reply({
//         attachment:{
//             type: 'template',
//             payload:{
//                 template_type: 'receipt',
//                 recipient_name: 'Harshil',
//                 order_number: '123456789',
//                 currency: 'INR',
//                 payment_method: 'Cash On Delivery',
//                 elements: [
//                     {
//                         title: flavor + " Pizza",
//                         quantity: 1,
//                         price: 50,
//                         subtitle: 'Size : ' + size,
//                         image_url: getUrl(flavor).toSource()
//                     }
//                 ]
//             }
//         }
//     });
// };

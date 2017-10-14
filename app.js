// This loads the environment variables from the .env file
//require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var LookingForLabels = ["dress", "shoes"];
var LookingFor = "";
var OccasionLabels = ["wedding", "exploring", "partywear"];
var Occasion = "";
var BodyTypeLabels = ["athletic","skinny", "hourglass","pear","curvy"];
var Bodytype = "";
var SkinToneLabels = ["fair","mocha", "olive","dark"];
var SkinTone = "";
var BudgetRangeLabel=["<$30"]


var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send('WELCOME TO STYLOSHEBOT')
        builder.Prompts.choice(session, "What are you looking for?", LookingForLabels);

    },
    function (session, result) {
        console.log(result);
        LookingFor = result.response.entity;
        session.send("you selected " + LookingFor);
        builder.Prompts.choice(session, "What's the occassion?", OccasionLabels);
    },
    function (session, result) {
        Occasion = result.response.entity;
        session.send("you selected " + Occasion);
        builder.Prompts.choice(session, "What's your body type?", BodyTypeLabels);
    },
    function (session, result) {
        Bodytype = result.response.entity;
        session.send("you selected " + Bodytype);
        builder.Prompts.choice(session, "What's your skin tone?", SkinToneLabels);
    },
    function (session, result) {
        SkinTone = result.response.entity;
        session.send("you selected " + SkinTone);
        builder.Prompts.choice(session, "What's the budget you are looking for?", BudgetRangeLabel);
        var cards = [getdressCard(session, {}), getdressCard(session, {})];

        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.send(reply);


        //builder.Prompts.choice(session, "What's your skin tone?", SkinToneLabels);
        //session.endDialog();
    }
]);

function getdressCard(session, dress) {
    var card = new builder.HeroCard(session)
        .title('Azure Storage')
        .subtitle('Offload the heavy lifting of data center management')
        .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
        .images([
            builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
        ]);

    return card;


}



function readJSON(session, dress) {
    var card = new builder.HeroCard(session)
        .title('Azure Storage')
        .subtitle('Offload the heavy lifting of data center management')
        .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
        .images([
            builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
        ]);

    return card;


}



//bot.dialog('Outfit', require('./outfit'));
//bot.dialog('hotels', require('./makeup'));
//bot.dialog('support', require('./support'))
//        matches: [/help/i, /support/i, /problem/i]
//    });

// log any bot errors into the console
// bot.on('error', function (e) {
//     console.log('And error ocurred', e);
// });
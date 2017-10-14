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
var dresses = readJSON();
console.log(dresses.items.dresses[1]);

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send('Hey there! Im StyloSHEbot. Your personal fashion adviser');
        builder.Prompts.choice(session, "What are you looking for?", LookingForLabels);

    },
    function (session, result) {
        console.log(result);
        LookingFor = result.response.entity;
        session.send( LookingFor + " hmm sexy!");
        builder.Prompts.choice(session, "What's the occassion?", OccasionLabels);
    },
    function (session, result) {
        Occasion = result.response.entity;
        session.send(Occasion + " yeah! Woohoo <3");
        builder.Prompts.choice(session, "What's your body type?", BodyTypeLabels);
    },
    function (session, result) {
        Bodytype = result.response.entity;
        session.send("You selected " + Bodytype);
        builder.Prompts.choice(session, "What's your skin tone?", SkinToneLabels);
    },
    function (session, result) {
        SkinTone = result.response.entity;
        session.send("You selected " + SkinTone);
        builder.Prompts.choice(session, "What's the budget you are looking for?", BudgetRangeLabel);    
    },

    function (session, result) {
        BudgetRangeLabel = result.response.entity;
        session.send("You selected budget range of  " + BudgetRangeLabel);
        var  matchDressCard = matchDress(Occasion,Bodytype,SkinTone);
        var dressCard =matchDressCard.map(function(dress){
            return getdressCard(session, dress);
        });
        session.send("There you go,here are the choices that's matching the selected criteria  ");
        //var cards = [getdressCard(session, {})];
        
                // create reply with Carousel AttachmentLayout
                var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(dressCard);       
                session.send(reply);
        //builder.Prompts.choice(session, "What's your skin tone?", SkinToneLabels);
        //session.endDialog();
    }
]);

function getdressCard(session, dress) {
    var card = new builder.HeroCard(session)
        .title(dress.description)
       // .subtitle(dress.description)
       // .text('Here are the matching dresses we found')
        .images([
            builder.CardImage.create(session, dress.img_url)
        ])
        .buttons([
            builder.CardAction.openUrl(session, dress.img_url, 'Learn More')
        ]);

    return card;


}



function readJSON() {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    var jsonObj =require('./data.json');
    return jsonObj;
}



function calculateScore(dress,occassion,skintone,bodytype) {
    var score =0;
    console.log(dress);
        if (dress.occasions.includes(occassion)){
            console.log("matches");
            score =score+1;
        }
   
        if (dress.dress_color_tones.includes(skintone)){
            console.log("matches");
            score =score+1;
        }
        if (dress.body_types.includes(bodytype)){
            console.log("matches");
            score =score+1;
        }
        return score;

}



function matchDress(occassion,skintone,bodytype) {
    result=[];
    var dressScoreMatch =0;
    var dressarray=dresses.items.dresses;
    var length =dressarray.length;
    console.log("We are inmatchdress")
    console.log(dressarray);
    
    for (i=0;i<length;i++){
       dress= dressarray[i];
        var score=calculateScore(dress,occassion,skintone,bodytype);
        if (score ==dressScoreMatch){
            result.push(dress);
        }else if (score >dressScoreMatch)
        {
            result=[dress];
        }

    }
    return result;

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
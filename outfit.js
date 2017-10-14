// outfit.js
module.exports = [
    // Destination
    function (session) {
        session.send('Welcome to your personal outfit finder');
        builder.Prompts.text(session, 'Please enter your criteria');
    },
    function (session, results, next) {
        session.dialogData.destination = results.response;
        session.send('Looking for outfits in %s', results.response); 
        next();
    }
   
];
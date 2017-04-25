var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personalityInsights = new PersonalityInsightsV3({
    username: XXX, // REPLACE WITH YOUR PERSONALITY_INSIGHTS USERNAME
    password: XXX, // REPLACE WITH YOUR PERSONALITY_INSIGHTS PASSWORD
    version_date: '2016-10-19'
});

function toContentItem(tweet) {
    XXX
    // RETURN A NEW CONTENTITEM ELEMENT WITH PROPERTIES 'id', 'language', 'contenttype', 'content' AND 'created'
}

function getProfile(params) {
    return new Promise(function (resolve, reject) {
        XXX
        // CALL PERSONALITY INSIGHTS PROFILE API WITH PARAMETERS  'params', IN THE BODY OF THE
        // CALLBACK FUNCTION IF THERE'S AN ERROR, CALL THE 'reject' FUNCTION PASSING THE ERROR OBJECT,
        // OTHERWISE CALL THE 'resolve' FUNCTION PASSING THE RESPONSE OBJECT
    });
}

function profileFromTweets(tweets) {
    var params = {
        content_items: tweets.map(toContentItem)
    }
    return getProfile(params);
}

module.exports.profileFromTweets = profileFromTweets;

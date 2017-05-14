var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var PERSONALITY_USER;
var PERSONALITY_PASSWORD;

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    for (var svcName in services) {
        if (svcName.match("personality_insights")) {
            PERSONALITY_USER = services[svcName][0].credentials.username;
            PERSONALITY_PASSWORD = services[svcName][0].credentials.password;
        }
    }
}

var personalityInsights = new PersonalityInsightsV3({
    username: PERSONALITY_USER,
    password: PERSONALITY_PASSWORD,
    version_date: '2016-10-19'
});

function toContentItem(tweet) {
    return {
        id: tweet.message.id,
        language: tweet.message.twitter_lang,
        contenttype: 'text/plain',
        content: tweet.message.body.replace('[^(\\x20-\\x7F)]*', ''),
        created: Date.parse(tweet.message.postedTime),
    };
}

function getProfile(params) {
    return new Promise(function (resolve, reject) {
        personalityInsights.profile(params, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        })
    });
}

function profileFromTweets(tweets) {
    var params = {
        content_items: tweets.map(toContentItem)
    }
    return getProfile(params);
}

module.exports.profileFromTweets = profileFromTweets;

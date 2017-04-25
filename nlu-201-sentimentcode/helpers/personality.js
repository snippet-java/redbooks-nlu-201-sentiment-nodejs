var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personalityInsights = new PersonalityInsightsV3({
    username: 'fd0c2a8c-6504-446c-9a20-5a34dc962c1e', // REPLACE WITH YOUR PERSONALITY_INSIGHTS USERNAME
    password: 'sGtXc1NGAB0Z', // REPLACE WITH YOUR PERSONALITY_INSIGHTS PASSWORD
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

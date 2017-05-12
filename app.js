var NLU_USER = '46941c99-9f46-4fe0-980f-da4c5e492558'; // REPLACE WITH YOUR NLU USER
var NLU_PASSWORD = '1pyPqZAfdBpm'; // REPLACE WITH YOUR NLU PASSWORD
var TWITTER_INSIGHTS_USER = '1d519921-0506-48f9-b8b9-f5bec95f9b2b'; // REPLACE WITH YOUR TWITTER_INSIGHTS USER
var TWITTER_INSIGHTS_PASSWORD = '04dKoismny'; // REPLACE WITH YOUR TWITTER_INSIGHTS PASSWORD

var express = require('express');
var routes = require('./routes');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var index = require('./routes/index');
var request = require("request");
var personalityHelper = require("./helpers/personality");

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username' : NLU_USER,
    'password' : NLU_PASSWORD,
    'version_date' : NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index);
app.post('/analyze', analyze);

module.exports = app;

function analyze(req, res) {
    var size = req.body.size && req.body.size < 500 /* max value */ ? req.body.size : 200 /* default value */;
    var query = req.body.query;
    var req_parameters = '?size=' + size + '&q=' + query;
    var url = 'https://' + TWITTER_INSIGHTS_USER + ':' + TWITTER_INSIGHTS_PASSWORD + '@cdeservice.mybluemix.net:443/api/v1/messages/search' + req_parameters;

    request(url, function (error, reqResponse, body) {
        if (!error && reqResponse.statusCode == 200) {
            body = JSON.parse(body);
            var tweets = body.tweets;
            console.log('#tweets = ' + tweets.length);
        }
        for (var i = 0; i < tweets.length; i++) {
            // analyze sentiment with Natural Language Understanding
            callNLUAPI(tweets[i]).then();
        }
        personalityHelper.profileFromTweets(tweets).then(function (personality) {
            return res.json(buildResult(tweets, personality));
        }).catch(function (error) {
            return res.json(buildResult(tweets, null, error.error));
        });
    });
}

function buildResult(tweets, personality, error) {
    var result = {
        personality: personality,
        tweets: tweets,
        error: error
    }
    console.log('analysis = ' + JSON.stringify(result, null, 2));
    return result;
}

function callNLUAPI(tweet) {
    return new Promise(function (resolve, reject) {
        var parameters = {
            text: tweet.message.body,
            features : {
                sentiment : {}
            }
        };
        natural_language_understanding.analyze(parameters, function(error, sentimentResponse) {
            if (error) {
                tweet.nlu_sentiment = "ERROR"
            } else {
                tweet.nlu_sentiment = sentimentResponse.sentiment.document;
            }
            return resolve();
        });
    });
}


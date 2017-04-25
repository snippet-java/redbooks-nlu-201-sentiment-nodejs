var NLU_USER = XXX; // REPLACE WITH YOUR NLU USER
var NLU_PASSWORD = XXX; // REPLACE WITH YOUR NLU PASSWORD
var TWITTER_INSIGHTS_USER = XXX; // REPLACE WITH YOUR TWITTER_INSIGHTS USER
var TWITTER_INSIGHTS_PASSWORD = XXX; // REPLACE WITH YOUR TWITTER_INSIGHTS PASSWORD

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
    var size = XXX; // SET THE AMOUNT OF TWEETS TO ANALYZE, MAX 500;
    var query = XXX; // GET FROM THE REQUEST (REQ) THE TWITTER HANDLER
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
            text: XXX, // REPLACE WITH THE TWEET MESSAGE
            features : {
                sentiment : {}
            }
        }
        XXX
        // CALL THE NLU SENTIMENT API.
        // IF THERE'S AN ERROR LOAD THE 'tweet.nlu_sentiment' PROPERTY WITH THE "ERROR" STRING,
        // OTHERWISE LOAD THE SAME PROPERTY WITH THE 'sentiment.document' OBTAINED FROM NLU API
    });
}


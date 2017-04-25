$(document).ready(function () {
    $("#analyze").click(function () {
        analyze();
    });
});

function analyze() {
    showProcessing(true);
    var message = {
        "query": 'from:'.concat($("#tw_search").val().replace("@", "")).concat(" posted:2017-01-01")
    };
    var request = new XMLHttpRequest();
    request.open('POST', 'analyze', true);
    request.setRequestHeader("Content-type", "application/json");
    request.onload = function () {
        // process response
        var result = JSON.parse(request.response);
        XXX // CALL THE loadTweetFeed
        XXX // CALL THE loadPersonality
        showProcessing(false);
    };
    request.onerror = function () {
        showProcessing(false);
    }
    request.send(JSON.stringify(message));
}

function loadTweetFeed(tweets) {
    $("#tweets ul").html("");
    var li = ""
    var sent = null;
    for (var i = 0; i < tweets.length; i++) {
        sent = getSent(tweets[i].nlu_sentiment);
        li = "<li>";
        li += "<div class='tw_header'> <span class='tw_name'>" + tweets[i].message.actor.displayName + "</span> <span class='tw_handle'>@" + tweets[i].message.actor.preferredUsername + "</span> <span class='tw_time'>" + tweets[i].message.postedTime.substr(0, 10) + "</span> </div>";
        li += "<div> " + tweets[i].message.body + " </div>";
        li += "<div class='tw_footer'> <span class='tw_sent'>tweet sentiment:</span> </div>";
        li += "<div class='tw_footer'> <span class='tw_sent_value' style='width:" + sent.value + ";background-color: " + sent.color + ";'>" + sent.view + "</span> </div>";
        li += "</li>";
        $("#tweets ul").append(li);
    }
}

function loadPersonality(personality, error) {
    $("#sunburstChart").empty();
    if (personality) {
        // Create the chart, specifying the css selector that identifies the element to contain the chart
        // and the version of Watson Personality Insights profile to use, v2 or v3.  Default is v2.
        var chart = new PersonalitySunburstChart({
            'selector': '#sunburstChart', 'version': 'v3'
        });
        // Render the sunburst chart for a personality profile (version as specified in creating the chart)
        // and optionally a profile photo.  The photo will be inserted into the center of the sunburst chart.
        chart.show(personality, '/img/profile_photo.jpg');
    } else {
        $("#sunburstChart").append("<span>" + error + "</span>")
    }
}

function getSent(sentiment) {
    var sent = {};
    if (!sentiment || "ERROR" == sentiment) {
        sent.view = "ERR"
        sent.value = "auto";
        sent.color = "transparent";
    } else if ("positive" == sentiment.label) {
        sent.view = "+" + sentiment.score;
        sent.value = (sentiment.label * 100) + "%";
        sent.color = "#a8dea8";
    } else if ("neutral" == sentiment.label) {
        sent.view = "0";
        sent.value = "auto";
        sent.color = "transparent";
    } else if ("negative" == sentiment.label) {
        sent.view = sentiment.score;
        sent.value = (sentiment.score * -100) + "%";
        sent.color = "#ffb5b5";
    }
    return sent;
}

function showProcessing(show) {
    if (show) {
        $("#analyze").hide();
        $("#results").hide();
        $("#thinking-wrapper").show();

    } else {
        $("#thinking-wrapper").hide();
        $("#results").show();
        $("#analyze").show();
    }
}
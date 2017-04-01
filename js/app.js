const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // maybe not needed
const Twit = require('twit');
const getRecentTweets = require('../js/getrecenttweets.js');
const moment = require('moment');

const routes = require('../routes/index.js');
const config = require('./config.js');

const T = new Twit({
    consumer_key : config.consumerKey,
    consumer_secret : config.consumerSecret,
    access_token : config.accessToken,
    access_token_secret : config.accessTokenSecret
});

const app = express();

// Views and static fileserver
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
//app.set('view options', { layout: false });
app.use(express.static(path.join(__dirname, '..', 'public')));

    //modules//

//calibrate the closure below - watch video
app.use((req, res, next) => {
    T.get('statuses/home_timeline', {count : 5}, function (err, data, res) {
        let tweets = [];
        for (let item in data) {

            //calculate time passed since tweet was created
            let createdDate = new Date(data[item].created_at);
            let createdDateMoment = moment(createdDate);
            let nowDate = moment();
            let hours = moment(nowDate.diff(createdDate)).format('h');
            console.log(hours);


            let tweet = {
                id : data[item].id,
                source : data[item].source,
                time_passed : hours,
                text: data[item].text,
                retweet_count : data[item].retweet_count,
                favorite_count: data[item].favorite_count,
                user_name: data[item].user.name,
                user_screen_name : data[item].user.screen_name,
                user_id : data[item].user.id,
                user_profile_image_url : data[item].user.profile_image_url
            };
            console.log(data[item].user.profile_image_url);
            tweets.push(tweet);
        }
        req.tweets = tweets;
        next();
    });
});




//////////////////////
    //modules//

// Router //
// for root context
app.use('/', routes);

// Error handlers //

// 404 //
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces printed
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status,
        error: {}
    });
});

var listener = app.listen(3000, function () {
    console.log('Express server listening on port ' + listener.address().port);
});

module.exports = app;
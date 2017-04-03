'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const twitterService = require ('./twitterservice.js');
const routes = require('../routes/index.js');
const config = require('./config.js');

const app = express();

const Twit = require('twit');

const T = new Twit({
    consumer_key : config.consumerKey,
    consumer_secret : config.consumerSecret,
    access_token : config.accessToken,
    access_token_secret : config.accessTokenSecret
});

// Views and static fileserver
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

//load json parser middleware
// reads the form's value and places it in the req object of the post request --> returns a 'body' property, form elements can be accessed
// as body.number, body.title, etc. Form values always arrive as a string
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));


    // middlewares retrieving user account settings, the timeline status, followed users, received direct messages

app.use(twitterService.getUser({url: 'account/settings'}));
app.use(twitterService.getCredentials({url : 'account/verify_credentials'}));
app.use(twitterService.getRecentTweets({url : 'statuses/home_timeline', count: 5}));
app.use(twitterService.getFriends({url : 'friends/list', count: 5}));
app.use(twitterService.getFriendsCount({url : 'friends/ids', count: 5000}));
app.use(twitterService.getDirectMessages({url: 'direct_messages', count : 5}));

    // middleware to post tweets
app.use((req, res, next) => {
        if (req.body.tweet === undefined) {
            return next();
        }
        T.post('statuses/update', {status: req.body.tweet}, (err, data, response) => {
            if (data) {
                console.log('Tweet posted, check your account!');
                res.json({status : 200, message : 'OK'})
            }
        });
    }
);

// to implement unfollow create a POST/DELETE
// https://dev.twitter.com/rest/reference/post/friendships/destroy


//////////////////////

// Router //
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
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status,
        error: err
    });
});

var listener = app.listen(3000, function () {
    console.log('Express server listening on port ' + listener.address().port);
});

//setting up IO and starting Twit stream

var io = require('socket.io').listen(listener);

var stream = T.stream('user');
stream.on('connected', function (request) {
    console.log('Connected');
});

// emit message when new tweet arrives on stream
stream.on('tweet', function (tweet) {
    console.log('tweet arrived');
    console.log(tweet);
    io.emit('tweet', tweet);
});

stream.on('error', function (err) {
    console.log(err);
});

module.exports = app;
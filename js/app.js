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

// bodyParser adds values to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

    // Middlewares to get user account settings, timeline status, followed users, received direct messages and for posting messages

app.use(twitterService.getUser({url: 'account/settings'}));
app.use(twitterService.getCredentials({url : 'account/verify_credentials'}));
app.use(twitterService.getRecentTweets({url : 'statuses/home_timeline', count: 5}));
app.use(twitterService.getFriends({url : 'friends/list', count: 5}));
app.use(twitterService.getFriendsCount({url : 'friends/ids', count: 5000}));
app.use(twitterService.getDirectMessages({url: 'direct_messages', count : 5}));

app.use(twitterService.postTweet({url:'statuses/update'}));


    // Router

app.use('/', routes);

    // Error handlers

    // 404
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
        status: err.status
    });
});

 // launching server

var listener = app.listen(3000, function () {
    console.log('Express server listening on port ' + listener.address().port);
});

    //setting up IO and starting Twit stream

var io = require('socket.io').listen(listener);

var stream = T.stream('user');
stream.on('connected', function (request) {
    console.log('Connected');
});

    // emit message when new tweet arrives in stream

stream.on('tweet', function (tweet) {
    console.log('tweet arrived');
    io.emit('tweet', tweet);
});

stream.on('error', function (err) {
    console.log(err);
});

module.exports = app;
'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // maybe not needed
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

    //modules//

//calibrate the closure below - watch video

app.use(twitterService.getUser({url: 'account/settings'}));
app.use(twitterService.getCredentials({url : 'account/verify_credentials'}));
app.use(twitterService.getRecentTweets({url : 'statuses/home_timeline', count: 5}));
app.use(twitterService.getFriends({url : 'friends/list', count: 5}));
app.use(twitterService.getFriendsCount({url : 'friends/ids', count: 5000}));
app.use(twitterService.getDirectMessages({url: 'direct_messages', count : 5}));

//app.use(twitterService.postTweet({status : req.body.tweettextarea}))

app.use((req, res, next) => {
        console.log('In post app.use')
        if (req.body.tweettextarea === undefined) {
            return next();
        }

        T.post('statuses/update', {status: req.body.tweettextarea}, (err, data, response) => {
            if (data) req.body.tweeted = 'Tweet posted, check your account!';
            console.log(req.body.tweeted);
        });
        next()
    }
);

// to implement unfollow create a POST
// https://dev.twitter.com/rest/reference/post/friendships/destroy


//////////////////////

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

module.exports = app;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // maybe not needed
const Twit = require('twit');
const getRecentTweets = require('./getrecenttweets.js');
const getFriends = require('./getfriends.js');
const getFriendsCount = require('./getfriendscount.js');
const getDirectMessages = require('./getdirectmessages.js');

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

app.use(getRecentTweets({url : 'statuses/home_timeline', count: 5}));

app.use(getFriends({url : 'friends/list', count: 5}));

app.use(getFriendsCount({url : 'friends/ids', count: 5000}));

app.use(getDirectMessages({url: 'direct_messages', count : 5}));

//app.use(unfollowFriends({url : 'friendships/destroy'}));

// to implement unfollow create a POST
// https://dev.twitter.com/rest/reference/post/friendships/destroy






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
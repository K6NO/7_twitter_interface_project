const Twit = require('twit');
const config = require('./config.js');

const T = new Twit({
    consumer_key : config.consumerKey,
    consumer_secret : config.consumerSecret,
    access_token : config.accessToken,
    access_token_secret : config.accessTokenSecret
});

module.exports.getUser = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, function (err, data, res) {
            if(!err){
                req.screen_name = data.screen_name;
                next();
            } else {
                console.error(err.message);
            }
        });
    }
};

module.exports.getCredentials = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, function (err, data, res) {
            if(!err){
                req.profile_image_url = data.profile_image_url;
                req.profile_banner = data.profile_background_image_url;
                next();
            } else {
                console.error(err.message);
            }
        });
    }
};

module.exports.getRecentTweets = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, {count : requestConfig.count}, function (err, data, res) {
            if(!err){
                req.tweets = data;
                next();
            } else {
                console.error(err.message);
            }
        });
    }
};

module.exports.getFriends = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, {count : requestConfig.count}, function (err, data, res) {
            if(!err){
                req.users = data.users;
                next();
            } else {
                console.error(err);
            }
        });
    }
};

module.exports.getFriendsCount = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, {count : requestConfig.count}, function (err, data, res) {
            let friendsCount = data.ids.length;
            req.friendsCount = friendsCount;
            next();
        });
    }
};

module.exports.getDirectMessages = (requestConfig) => {

    return (req, res, next) => {

        T.get(requestConfig.url, {count : requestConfig.count}, function (err, data, res) {
            if(!err){
                req.messages = data;
                next();
            } else {
                console.error(err);
            }
        });
    }
};

module.exports.postTweet = (requestConfig) => {
    return (req, res, next) => {
        if (req.body.tweettextarea === undefined) {
            return next();
        }
        if(!err) {
            const tweet = req.body.tweettextarea;

            T.post('statuses/update', {status: tweet}, function (err, data, response) {
                console.log(data);
            });
            next()
        } else {
            console.error(err);
        }
    };
};
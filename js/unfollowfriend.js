const Twit = require('twit');
const config = require('./config.js');
const moment = require('moment');

const T = new Twit({
    consumer_key : config.consumerKey,
    consumer_secret : config.consumerSecret,
    access_token : config.accessToken,
    access_token_secret : config.accessTokenSecret
});

module.exports = (requestConfig) => {
    let unfollowedFriend = req;
    return (req, res, next) => {
        T.post(requestConfig.url, {screen_name : req.userUnfollowed.screen_name}, function (err, data, res) {
        });
    }
};

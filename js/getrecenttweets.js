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

    return (req, res, next) => {
        T.get(requestConfig.url, {count : requestConfig.count}, function (err, data, res) {
            if(!err){
                req.tweets = data;
                next();
            } else {
                res.send(err.message);
            }
        });
    }
};




const Twit = require('twit');
const config = require('./config.js');

const T = new Twit({
    consumer_key : config.consumerKey,
    consumer_secret : config.consumerSecret,
    access_token : config.accessToken,
    access_token_secret : config.accessTokenSecret
});

module.exports = (requestConfig) => {

    return (req, res, next) => {
        T.get(requestConfig.url, function (err, data, res) {
            if(!err){
                req.profile_banner = data.sizes;
                next();
            } else {
               console.log(err);
            }
        });
    }
};
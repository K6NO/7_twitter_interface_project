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
            let tweets = [];
            for (let item in data) {

                //calculate time passed since tweet was created
                let createdDate = new Date(data[item].created_at);
                let createdDateMoment = moment(createdDate);
                let nowDate = moment();
                let hours = moment(nowDate.diff(createdDate)).format('h');

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
                tweets.push(tweet);
            }
            req.tweets = tweets;
            next();
        });
    }
};




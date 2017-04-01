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
            let users = [];
            for (let item in data.users) {

                let user = {
                    id : data.users[item].id,
                    name: data.users[item].name,
                    screen_name : data.users[item].screen_name,
                    profile_image_url : data.users[item].profile_image_url
                };
                users.push(user);
            }
            req.users = users;
            next();
        });
    }
};




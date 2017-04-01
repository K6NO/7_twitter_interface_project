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
            let messages = [];
            for (let item in data) {

                let createdDate = new Date(data[item].created_at);
                let createdDateMoment = moment(createdDate);
                let nowDate = moment();
                let hours = moment(nowDate.diff(createdDate)).format('h');

                console.dir(item);
                let message = {
                    id : data[item].id,
                    recipient_name: data[item].recipient.name,
                    recipient_image : data[item].recipient.profile_background_image_url,
                    hours : hours,
                    sender_name : data[item].sender.name,
                    sender_image : data[item].sender.profile_image_url,
                    text : data[item].text
                };
                console.log(data[item].sender.name);
                console.log(data[item].text);
                console.log(data[item].recipient.name);


                messages.push(message);
            }
            req.messages = messages;
            next();
        });
    }
};

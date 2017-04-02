const Twit = require('twit');
const config = require('./config.js');

module.exports = (config) => {
    return (req, res, next) => {
        if (req.body.tweet-textarea === undefined) {
            return next();
        }
        const tweet = (req.body.tweettextarea);

        T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
            console.log(data)
        })
        //storing the result on the request object in a parameter
        req.multiplied = result;
        next();
    };
};
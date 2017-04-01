module.exports = (config) => {

    return (req, res, next) => {
        T.get('home_timeline', {count: config.count}, function (err, data, res) {
            console.log(data);
            next();
        });
    }
};




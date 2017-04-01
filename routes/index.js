const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    console.log('In the router: ')
    //console.log(req.tweet);
    res.render('index', {
        tweets : req.tweets
    });
});

//pass values to return to the user here if user provides input
router.post('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;
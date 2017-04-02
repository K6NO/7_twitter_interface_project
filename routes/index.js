const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('get request');
    res.render('index', {
        tweets : req.tweets,
        users : req.users,
        friendsCount : req.friendsCount,
        messages : req.messages,
        screen_name : req.screen_name,
        profile_banner : req.profile_banner,
        profile_image : req.profile_image_url,
        tweeted : ''
    });
});

router.post('/', (req, res, next) => {
    console.log('post request');
    res.render('index' , {
        tweets : req.tweets,
        users : req.users,
        friendsCount : req.friendsCount,
        messages : req.messages,
        screen_name : req.screen_name,
        profile_banner : req.profile_banner,
        profile_image : req.profile_image_url,
        tweeted : req.body.tweeted
    });
});

module.exports = router;
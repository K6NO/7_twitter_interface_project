const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', {
        tweets : req.tweets,
        users : req.users,
        friendsCount : req.friendsCount,
        messages : req.messages
    });
});

//pass values to return to the user here if user provides input
router.post('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;
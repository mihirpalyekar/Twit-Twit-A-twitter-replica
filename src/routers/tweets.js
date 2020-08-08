const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const tweetController = require('../controllers/tweet.controller')

router.post('/tweet/create', auth, tweetController.createTweet)
router.get('/tweets/readAll', auth, tweetController.readAllTweet)
router.get('/tweet/read', auth, tweetController.readTweetById)
router.delete('/tweet/delete', auth, tweetController.deleteTweet)
router.get('/home', auth, tweetController.showHomePage)

module.exports = router
const express = require('express');
const auth = require('../middleware/auth')
const router = new express.Router();
const reTweetController = require('../controllers/reTweet.controller')

router.post('/tweet/retweet', auth, reTweetController.reTweeted)
router.delete('/tweet/retweet/delete', auth, reTweetController.deleteTweet)

module.exports = router
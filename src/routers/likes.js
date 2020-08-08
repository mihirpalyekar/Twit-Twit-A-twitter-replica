const express = require('express');
const auth = require('../middleware/auth')
const router = new express.Router();
const likeController = require('../controllers/likes.controller')

router.post("/tweet/likeTweet", auth, likeController.likeTweet)

module.exports = router
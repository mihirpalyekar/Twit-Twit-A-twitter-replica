const express = require('express')
const Reply = require('../models/reply')
const auth = require('../middleware/auth')
const Tweet = require('../models/tweets')
const router = new express.Router()
const replyController = require('../controllers/reply.controller')

router.post('/tweet/reply', auth, replyController.createReply)
router.delete('/tweet/reply/delete', auth, replyController.deleteReply)
router.post("/tweet/reply/like", auth, replyController.likeReply)

module.exports = router
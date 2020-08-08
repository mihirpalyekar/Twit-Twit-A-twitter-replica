const Reply = require('../models/reply')
const Tweet = require('../models/tweets')
const Like = require('../models/likes')

const createReply = async function(req, res) {
    const reply = new Reply({
        ...req.body,
        UserId: req.user._id,

    })
    try {
        const tweet = await Tweet.findOneAndUpdate({ _id: req.body.tweetId }, { $inc: { replyCount: 1 } }, { new: true })
        await tweet.save()
        await reply.save()
        res.status(201).send(reply)
    } catch (e) {
        res.status(400).send(e)
    }
}

const deleteReply = async function(req, res) {
    try {
        console.log(req.body.id)
        const reply = await Reply.findOne({ _id: req.body.id, UserId: req.user._id })
        console.log(reply);

        if (!reply) {
            return res.status(404).send('No replies on this Id')
        }
        const tweet = await Tweet.findOneAndUpdate({ _id: reply.tweetId }, { $inc: { replyCount: -1 } }, { new: true })
        await tweet.save()
        reply.remove()
        res.send(reply)
    } catch (e) {
        res.status(500).send()
    }
}

const likeReply = async function(req, res) {
    try {
        const like = await Like.findOne({ replyId: req.body.id, UserId: req.user._id })
        if (!like) {
            const like = new Like({
                replyId: req.body.id,
                UserId: req.user._id
            })
            const reply = await Reply.findById(req.body.id)
            reply.likeCount = reply.likeCount + 1
            reply.save()
            like.save()
            res.status(201).send("successfull")
        } else {
            const reply = await Reply.findById(req.body.id)
            reply.likeCount = reply.likeCount - 1
            reply.save()
            like.remove()
            like.save()
            res.status(201).send("successfull")
        }
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = {
    createReply,
    deleteReply,
    likeReply
}
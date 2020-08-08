const Like = require('../models/likes')
const Tweet = require('../models/tweets')

const likeTweet = async function(req, res) {
    try {
        const like = await Like.findOne({ tweetId: req.body.id, UserId: req.user._id })
        if (!like) {
            const like = new Like({
                ...req.body,
                UserId: req.user._id,
                tweetId: req.body.id
            })
            try {
                const tweet = await Tweet.findOne({ _id: req.body.id })
                tweet.likeCount = tweet.likeCount + 1
                await tweet.save()
                await like.save()
                res.status(201).send({ like, Tweet })
            } catch (e) {
                res.status(400).send(e)
            }
        } else {
            const tweet = await Tweet.findOne({ _id: req.body.id })
            tweet.likeCount = tweet.likeCount - '1'
            await tweet.save()
            await like.remove()
            res.status(200).send()
        }
    } catch (e) {
        res.status(500).send()
    }
}



module.exports = {
    likeTweet,
}
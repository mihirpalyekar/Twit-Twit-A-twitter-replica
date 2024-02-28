const ReTweet = require('../models/re_tweets')
const Tweet = require('../models/tweets')

const reTweeted = async function(req, res) {
    try {
        const isReTweeted = await ReTweet.findOne({ tweetId: req.body.id, UserId: req.user._id })
        if (!isReTweeted) {
            const retweet = new ReTweet({
                ...req.body,
                UserId: req.user._id,
                tweetId: req.body.id
            })
            try {
                const tweet = await Tweet.findOneAndUpdate({ _id: req.body.id }, { $inc: { reTwitteCount: 1 } }, { new: true })
                await tweet.save()
                await retweet.save()
                res.status(201).send({ tweet })
            } catch (e) {
                res.status(400).send(e)
            }
        } else {
            const tweet = await Tweet.findOneAndUpdate({ _id: req.body.id }, { $inc: { reTwitteCount: -1 } }, { new: true })
            await tweet.save()
            await isReTweeted.remove()
            res.status(200).send()
        }
    } catch (e) {

    }
}
const deleteTweet = async function(req, res) {
    try {
        
        const retweet = await ReTweet.findOne({ tweetId: req.body.id, UserId: req.user._id })
        retweet.remove()

        if (!retweet) {
            res.status(404).send('No retweets on this Id')
        }
        const tweet = await Tweet.findOneAndUpdate({ _id: req.body.id }, { $inc: { reTwitteCount: -1 } }, { new: true })
        await tweet.save()
        res.status(200).send("sucessfull operation")
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = {
    reTweeted,
    deleteTweet
}
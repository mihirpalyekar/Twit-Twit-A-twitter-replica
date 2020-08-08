const Tweet = require('../models/tweets')
const User = require('../models/user')
const utils = require('../utils/tweet')
const io = require('../../app').io



const createTweet = async function(req, res) {
    const tweet = new Tweet({
        ...req.body,
        createdBy: req.user._id
    })
    try {
        await tweet.save()

        res.status(201).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }
}

const readAllTweet = async function(req, res) {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tweet',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tweet)
    } catch (e) {
        res.status(500).send()
    }
}

const readTweetById = async function(req, res) {
    try {
        const tweet = await Tweet.findOne({ _id: req.body.id, createdBy: req.user._id })

        if (!tweet) {
            return res.status(404).send()
        }

        res.send(tweet)
    } catch (e) {
        res.status(500).send()
    }
}

const deleteTweet = async function(req, res) {
    try {
        const tweet = await Tweet.findOne({ _id: req.body.id, createdBy: req.user._id });
        await tweet.remove()
        if (!tweet) {
            res.status(404).send("cannot find tweet");
        }
        res.send(tweet);
    } catch (e) {
        res.status(500).send()
    }
}

const showHomePage = async function(req, res) {
    try {
        const toSend = [];
        const user = await User.findById({ _id: req.user.id })
        const following = Object.keys(user.following)

        for (const userId of following) {
            const latestTweet = await utils.getTweet(userId);
            const latestRetweet = await utils.getRetweet(userId);
            if (latestTweet) toSend.push(latestTweet);
            if (latestRetweet) toSend.push(latestRetweet);
        }
        res.render('home', {
            user
        })

    } catch (e) {

        res.status(500).send();
    }
}

module.exports = {
    createTweet,
    readAllTweet,
    readTweetById,
    deleteTweet,
    showHomePage
}
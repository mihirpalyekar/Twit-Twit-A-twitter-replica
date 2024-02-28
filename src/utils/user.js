const mongoose = require('mongoose');
const User = require('../models/user')
const ReTweet = require('../models/re_tweets')
const Tweet = require('../models/tweets')
const Like = require('../models/likes')
const Reply = require('../models/reply')


async function removeRetweet(user_id) {
    const allReTweet = await ReTweet.find({ UserId: user_id })
    allReTweet.forEach(async reTweet => {
        await Tweet.findByIdAndUpdate({ _id: reTweet.tweetId }, { $inc: { reTwitteCount: -1 } }, { new: true })
    })
}

async function removeReply(user_id) {
    const allComments = await Reply.find({ UserId: user_id })
    allComments.forEach(async removecomment => {
        await Tweet.findByIdAndUpdate({ _id: removecomment.tweetId }, { $inc: { replyCount: -1 } }, { new: true })
    })
}

async function removeLikes(user_id) {
    const allLikes = await Like.find({ UserId: user_id })
    allLikes.forEach(async like => {
        if (like.replyId) {
            await Reply.findByIdAndUpdate({ _id: like.replyId }, { $inc: { likeCount: -1 } }, { new: true })
            
        } else {
            await Tweet.findByIdAndUpdate({ _id: like.tweetId }, { $inc: { likeCount: -1 } }, { new: true })
        }

    });
}
module.exports = {
    removeRetweet,
    removeLikes,
    removeReply
}
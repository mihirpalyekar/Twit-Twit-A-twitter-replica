const Tweet = require('../models/tweets')
const ReTweet = require('../models/re_tweets')
const mongoose = require('mongoose');

const getTweet = async(userId) => {

    const latestTweets = await Tweet.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate('createdBy', 'firstName')
        .lean();

    const latestTweet = latestTweets[0];

    if (latestTweet) {

        latestTweet.type = "tweet";
        return latestTweet;

    }

};
const getRetweet = async(userId) => {

    const latestRetweets = await ReTweet.find({ UserId: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate('UserId', 'firstName')
        .populate({
            path: 'tweetId',
            select: 'content',
            populate: {
                path: 'createdBy',
                select: 'firstName'
            }
        })
        .lean();

    const latestRetweet = latestRetweets[0];

    if (latestRetweet) {

        latestRetweet.type = "retweet";
        return latestRetweet;

    }

};


// const getReply = async(userId) => {

//     const latestReplies = await Replie.find({ user: userId })
//         .sort({ createdAt: -1 })
//         .limit(1)
//         .populate('user', 'name')
//         .populate({
//             path: 'tweet',
//             select: 'text',
//             populate: {
//                 path: 'user',
//                 select: 'name'
//             }
//         })
//         .lean();

//     const latestTweet = latestReplies[0];

//     if (latestTweet) {

//         latestTweet.type = "reply";
//         return latestTweet;

//     }

// };

module.exports = {
    getTweet,
    getRetweet
}
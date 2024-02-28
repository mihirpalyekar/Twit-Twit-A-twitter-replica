const mongoose = require('mongoose')

const reTweetSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tweet'
    }
}, {
    timestamps: true
})


const ReTweet = mongoose.model('Retweet', reTweetSchema)

module.exports = ReTweet
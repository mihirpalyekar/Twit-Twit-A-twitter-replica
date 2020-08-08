const mongoose = require('mongoose');
const Like = require("./likes")
const Reply = require('./reply')

const tweetSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    likeCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        default: 0,
        type: Number
    },
    reTwitteCount: {
        type: Number,
        default: 0
    },
    reTwittedFlag: {
        type: Boolean,
        default: false
    },
    hashTagWord: []
}, {
    timestamps: true
})


tweetSchema.pre('remove', async function(next) {
    const tweet = this
    await Reply.deleteMany({ tweetId: tweet._id })
    await Like.deleteMany({ tweetId: tweet._id })
    next()
})

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet;
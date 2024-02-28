const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }
}, {
    timestamps: true
})


const Like = mongoose.model('Like', likeSchema)

module.exports = Like
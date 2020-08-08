const mongoose = require('mongoose')
const Like = require('./likes')


const replySchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        //required: true,
        maxlength: 1000
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tweet'
    },
    likeCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

replySchema.pre('remove', async function(next) {
    const reply = this
    await Like.deleteMany({ replyId: reply._id })
    next()
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply
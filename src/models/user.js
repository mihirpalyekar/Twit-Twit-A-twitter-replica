const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tweet = require('./tweets');
const Like = require('./likes')
const Reply = require('./reply')
const Utils = require('../utils/user')
const ReTweet = require('./re_tweets')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    twitterHandle: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Value of email is incorrect');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain "Password"')
            }
        }
    },
    follower: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    following: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
    minimize: false
})

userSchema.virtual('tweet', {
    ref: 'Tweet',
    localField: '_id',
    foreignField: 'createdBy'
})

userSchema.virtual('like', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'UserId'
})

userSchema.virtual('followingList').get(function() {
    return Object.keys(this.following);
});

userSchema.virtual('followerList').get(function() {
    return Object.keys(this.follower);
});

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

userSchema.methods.generateHandle = async function(email) {

    this.twitterHandle = email.split('@')[0]
    await this.save()
}

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject
}
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login');
    }
    return user
}

userSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Utils.removeLikes(user._id)
    await Utils.removeRetweet(user._id)
    await Utils.removeReply(user._id)
    await ReTweet.deleteMany({ UserId: user._id })
    await Tweet.deleteMany({ createdBy: user._id })
    await Reply.deleteMany({ UserId: user._id })
    await Like.deleteMany({ UserId: user._id })
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;
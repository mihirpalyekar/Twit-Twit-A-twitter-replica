const User = require('../models/user')
const sharp = require('sharp')
const multer = require('multer');



const Register = async function(req, res) {
    const user = new User(req.body);
    try {
        await user.generateHandle(req.body.email)
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ redirect: '/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

const Login = async function(req, res) {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ redirect: '/home' });
    } catch (e) {
        res.status(400).send(e)
    }
}

const Profile = async function(req, res) {
    const user = req.user
    res.render('profile', {
        user
    })
}

const Logout = async function(req, res) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send({ redirect: '/' });
    } catch (e) {
        res.status(500).send()
    }
}

const LogoutAll = async function(req, res) {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send("Successfully logout all users");
    } catch (e) {
        res.status(500).send()
    }
}

const UpdateProfile = async function(req, res) {
    const updates = Object.keys(req.body);
    const updatesAllowed = ['firstName', 'lastName', 'email', 'password'];
    const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

const DeleteProfile = async function(req, res) {
    try {
        //updating follower and following info of other users before deletion
        const currentUserID = req.user._id.toString();

        await User.updateMany({ _id: { $in: req.user.followingList } }, {

            $unset: {
                [`follower.${currentUserID}`]: ""
            }
        });

        await User.updateMany({ _id: { $in: req.user.followerList } }, {
            $unset: {
                [`following.${currentUserID}`]: ""
            }
        });
        await req.user.remove()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
}

const Upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please provide with standard image file'))
        }
        cb(undefined, true)
    }
})

const uploadAvatar = async function(req, res) {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('success');
}

const deleteAvatar = async function(req, res) {
    try {
        req.user.avatar = undefined;
        await req.user.save()
        res.send('success');
    } catch (e) {
        res.status(500).send()
    }
}

const getAvatar = async function(req, res) {
    try {
        const user = await User.findById(req.body.id)

        if (!user || !user.avatar) {
            throw new Error("something is wrong")
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send();
    }
}

const userFollow = async function(req, res) {
    const userProfile = req.user
    const userId = req.user._id
    const friendId = req.body._id
    try {
        const friendProfile = await User.findOne({ _id: friendId })

        if (friendId in userProfile.following) {

            delete userProfile.following[friendId]
            delete friendProfile.follower[userId]

            userProfile.markModified('following')
            friendProfile.markModified('follower')
            await friendProfile.save()
            await userProfile.save()
            return res.status(201).send(userProfile)

        }

        friendProfile.follower[userId] = userId
        userProfile.following[friendId] = friendId

        userProfile.markModified('following')
        friendProfile.markModified('follower')
        await friendProfile.save()
        await userProfile.save()
        res.status(201).send(userProfile)

    } catch (e) {
        res.status(500).send();
    }
}

module.exports = {
    Register: Register,
    Login: Login,
    Profile: Profile,
    Logout: Logout,
    LogoutAll: LogoutAll,
    UpdateProfile: UpdateProfile,
    DeleteProfile: DeleteProfile,
    uploadAvatar: uploadAvatar,
    Upload: Upload,
    deleteAvatar: deleteAvatar,
    getAvatar: getAvatar,
    userFollow: userFollow
}
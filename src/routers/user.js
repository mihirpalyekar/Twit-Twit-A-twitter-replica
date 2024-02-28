const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const router = new express.Router();
const multer = require('multer');
const userControllers = require('../controllers/user.controller')

router.post("/register", userControllers.Register)
router.post("/login", userControllers.Login)
router.get("/user/profile", auth, userControllers.Profile)
router.post("/user/logout", auth, userControllers.Logout)
router.post("/user/logoutAll", auth, userControllers.LogoutAll)
router.patch('/user/profile/update', auth, userControllers.UpdateProfile)
router.delete('/user/deleteProfile', auth, userControllers.DeleteProfile)
router.post('/user/profile/uploadAvatar', auth, userControllers.Upload.single('avatar'), userControllers.uploadAvatar)
router.delete('/user/profile/deleteAvatar', auth, userControllers.deleteAvatar)
router.get('/user/avatar', userControllers.getAvatar)
router.post('/user/follow', auth, userControllers.userFollow)

module.exports = router;
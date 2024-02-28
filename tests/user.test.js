const request = require('supertest')
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const app = require("../app")
const User = require("../src/models/user")


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    firstName: 'mike',
    lastName: 'colt',
    email: 'mikecolt@example.com',
    password: 'pass@123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async() => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('should signup the user', async() => {
    const response = await request(app).post('/users').send({
        firstName: "mihir",
        lastName: "palyekar",
        email: "mihirpalyekarnew8@gmail.com",
        password: "abcd@0987"
    }).expect(201)
    console.log(response);
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should login Existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login non Existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypassword'
    }).expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})


test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
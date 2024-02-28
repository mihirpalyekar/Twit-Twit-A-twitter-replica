const express = require('express');
const path = require('path')
const hbs = require('hbs')
const http = require('http')
require('./src/db/mongoose')
const cookieParser = require('cookie-parser')
const socketio = require('socket.io')

const userRouter = require('./src/routers/user')
const tweetRouter = require('./src/routers/tweets')
const likeRouter = require('./src/routers/likes')
const replyRouter = require('./src/routers/reply')
const reTweetRouter = require('./src/routers/reTweet')
    //Define paths for express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

const app = express()

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to server
app.use(express.static(publicDirectoryPath))

const server = http.createServer(app)
const io = socketio(server)

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(express.json());
app.use(cookieParser())
app.use(userRouter);
app.use(tweetRouter);
app.use(likeRouter);
app.use(replyRouter);
app.use(reTweetRouter)


app.get('/', (req, res) => {
    res.render('login')
})

// app.get('/home1', (req, res) => {
//   res.render('home')
// })

// app.get('/profile1', (req, res) => {
//     res.render('profile')
// })

module.exports = server
require('dotenv').config()

const bodyParser = require('body-parser');
const express = require('express')
const routes = require('./routes')

const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const csrf = require('csurf')

const app = express()

mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
  app.emit('done')
})
.catch(e => console.log(e))

const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(
  bodyParser.urlencoded(
    {
      extended: true
    }
  )
)

app.use(helmet())

app.use(bodyParser.json())

const sessionOptions = session({
  secret: '1hzu3huzh513u5h1 h119djosdjq8 0sd0qweq',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})

app.use(sessionOptions)

app.use(routes)

app.on('done', () => {
  app.listen(3000, () => {
    console.log('Server running on the 3000 port')
  })  
})

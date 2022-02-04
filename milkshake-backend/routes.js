const express = require('express')
const route = express.Router()

const syncController = require('./src/controllers/syncController')

// sync routes
route.get('/sync', syncController.push)
route.post('/sync/:lastPulledAt?/:schemaVersion?/:migration?', syncController.pull)

module.exports = route
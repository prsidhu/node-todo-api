require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')

var mongoose = require('./db/mongoose')
const {assignApiRoutes} = require('./api/index')

var app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

assignApiRoutes(app)

app.listen(port, () => {
    console.log(`running on ${port}`)
})

module.exports = {app}
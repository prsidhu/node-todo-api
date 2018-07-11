require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const _ = require('lodash')
const bcrypt = require('bcryptjs')


var mongoose = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {authenticate} = require('./middleware/authenticate')
const {assignAnnotationApi} = require('./api/annotations')

var app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user.id
    })

    todo.save().then((doc) => {
        res.status(200).send(doc)
    }, (e) => res.status(400).send(e))
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user.id}).then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'Invalid id'
        })
    } 
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(todo)
            return res.status(200).send({todo})
        else
            return res.status(404).send({
                error: 'no todo found for the given id'
            })
    }, (e) => res.status(400).send(e))
})

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'Invalid id'
        })
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo)
            return res.status(404).send({error: 'no todo found'})
        
        return res.status(200).send({todo})
    }).catch((e) => res.status(400).send(e))
})

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'Invalid id'
        })
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo)
            return res.status(404).send()

        return res.status(200).send({todo})
    }).catch((e) => res.status(400).send())
})

app.post('/users', async (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)
    try{
        await user.save()
        var token = await user.generateAuthToken()
        res.header('x-auth', token).send(user)
    } catch(e) {res.status(400).send(e)}
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password'])
        let user = await User.findByCredentials(body.email, body.password)
        let token = await user.generateAuthToken()
        res.header('x-auth', token).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => res.status(400).send())
})



app.listen(port, () => {
    console.log(`running on ${port}`)
})

module.exports = {app}
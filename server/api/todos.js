const {ObjectID} = require('mongodb')
const _ = require('lodash')

var {Todo} = require('../models/todo')
var {authenticate} = require('../middleware/authenticate')


const assignTodoRoutes = (app) => {
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
}

module.exports = {assignTodoRoutes}
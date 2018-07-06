const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '5b3f27acd4930ab65f223f7d'

// Todo.find({
//     _id: id
// }).then((todos) => console.log(todos))

// Todo.findOne({
//     completed: false
// }).then((todo) => console.log('Todo: ', todo))

if(!ObjectID.isValid(id)) {
    console.log('invalid id')
}

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('could not find todo')
    }
    console.log('Todo by id: ', todo)
}).catch((e) => console.log(e))
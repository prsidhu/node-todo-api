const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '5b3f2faea3f62bb8a5e12908'

Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo)
})
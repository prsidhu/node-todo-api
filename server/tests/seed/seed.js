const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('../../models/todo')
const {User} = require('../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const todos = [
    {
        _id: new ObjectID(),
        text: 'test 1',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'text 2',
        completed: true,
        completedAt: 234234,
        _creator: userTwoId
    }
]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

const users = [{
    _id: userOneId,
    email: 'harry@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save()
        var userTwo = new User(users[1]).save()

        return Promise.all([userOne, userTwo])
    }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}
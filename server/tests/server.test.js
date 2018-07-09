const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateTodos)
beforeEach(populateUsers)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create new todo on bad request', (done) => {
        var text = ' '

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .expect((res) => {
                expect(res.body.hasOwnProperty('errors'))
            })
            .end((err, res) => {
                if(err)
                    return done(err)

                Todo.find({}).then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('Invalid id')
            })
            .end(done)
    })

    it('should return a todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should not return todo for valid but absent id', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('no todo found for the given id')
            })
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('Invalid id')
            })
            .end(done)
    })

    it('should return the deleted todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end((err, res) => {
                if(err)
                    return done(err)

                Todo.find({}).then((todos) => {
                    expect(todos.length).toBe(1)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not return todo for valid but absent id', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('no todo found')
            })
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        var id = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${id}`)
            .send({completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true)
            })
            .end(done)
    })

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString()
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if(err)
                    return done(err)

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0].token).toBe(res.headers['x-auth'])
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'woof'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy()
        })
        .end((err, res) => {
            if(err)
                return done(err)

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e) => done(e))
        })
    })
})
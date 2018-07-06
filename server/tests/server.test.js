const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')


const todos = [
    {
        text: 'test 1'
    },
    {
        text: 'text 2'
    }
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})

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

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3)
                    expect(todos[2].text).toBe(text)
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
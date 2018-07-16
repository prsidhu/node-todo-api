const _ = require('lodash')

let {app} = require('../server')
var {authenticate} = require('../middleware/authenticate')
var {User} = require('../models/user')

const assignUsersRoutes = (app) => {
    app.post('/users', async (req, res) => {
        console.log('post users')
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
}

module.exports = {assignUsersRoutes}
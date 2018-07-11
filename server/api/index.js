const {assignAnnotationApi} = require('./annotations')
const {assignUsersRoutes} = require('./users')
const {assignTodoRoutes} = require('./todos')

const assignApiRoutes = (app) => {
    console.log('here!')
    assignTodoRoutes(app)
    assignUsersRoutes(app)
    assignAnnotationApi(app)
}

module.exports = {assignApiRoutes}
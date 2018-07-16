const {assignAnnotationApi} = require('./annotations')
const {assignUsersRoutes} = require('./users')
const {assignTodoRoutes} = require('./todos')
const {assignEntryRoutes} = require('./enteries')

const assignApiRoutes = (app) => {
    assignTodoRoutes(app)
    assignUsersRoutes(app)
    assignAnnotationApi(app)
    assignEntryRoutes(app)
}

module.exports = {assignApiRoutes}
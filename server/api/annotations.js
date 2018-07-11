const {app} = require('../server')
const {Todo} = require('../models/todo')
var {authenticate} = require('../middleware/authenticate')

const assignAnnotationApi = (app) => {
    // Update todo
    app.patch('/todos/:id', authenticate, async (req, res) => {
        try {
            const tags = req.body.tags
            const id = req.params.id
        
            if(!ObjectID.isValid(id)) {
                return res.status(404).send({
                    error: 'Invalid id'
                })
            }
        
            let todo = Todo.findOneAndUpdate({
                _id: id,
                _creator: req.user._id
            })
        
            if(!todo)
                throw new Error()
        
            res.status(200).send({todo})
        } catch (e) {res.status(400).send({errorMessage: 'Could not update the todo'})}
    })
}

module.exports = {assignAnnotationApi}
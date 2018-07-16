const {ObjectID} = require('mongodb')
const _ = require('lodash')

var {Entry} = require('../models/entry')
var {authenticate} = require('../middleware/authenticate')

const assignEntryRoutes = (app) => {
    // Create a new entry
    app.post('/entry', authenticate, async (req, res) => {
        let body = _.pick(req.body, ['text', 'annotations'])

        let entry = new Entry({
            text: body.text,
            _creator: req.user.id,
            annotations: body.annotations
        })
        let doc = await entry.save()
        console.log(doc)
        if(doc) {
            res.status(200).send(doc)
        } else {
            res.status(401).send(`Couldn't save entry`)
        }
    })
}

module.exports = {assignEntryRoutes}

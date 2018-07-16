var mongoose = require('mongoose')

var Annotation = mongoose.model('annotation', {
    tag: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

module.exports = {Annotation}
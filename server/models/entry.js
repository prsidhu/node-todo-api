var mongoose = require('mongoose')

var Entry = mongoose.model('Entry', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    annotations: [{
        type: String,
        required: false,
        trim: true,
        minlength: 1
    }],
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = {Entry}
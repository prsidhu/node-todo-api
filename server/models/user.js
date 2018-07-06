var mongoose = require('mongoose')

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    }
})

module.exports = {User}
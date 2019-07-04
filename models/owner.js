const mongoose = require('mongoose')

const OwnerSchema = new mongoose.Schema({
    place: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    oldUser: {
        type: String,
    },
    complete: {
        type: Boolean,
        default: false
    }
})

const Owner = mongoose.model('Owner', OwnerSchema)

module.exports = Owner
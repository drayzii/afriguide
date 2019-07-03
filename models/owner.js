const mongoose = require('mongoose')

const OwnerSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Owner = mongoose.model('Owner', OwnerSchema)

module.exports = Owner
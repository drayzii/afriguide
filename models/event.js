const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    entrance: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event
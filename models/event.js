const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    by: {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    place: {
        _id: {
            type: String
        },
        name: {
            type: String,
            required: true
        }
    },
    description: {
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        entrance: {
            type: String,
            required: true
        },
        photo: {
            type: String
        }
    },
    interested: [ new mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        name: {
            type: String,
            required: true
        },
        photo: {
            type: String
        }
    })],
    going: [ new mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        name: {
            type: String,
            required: true
        },
        photo: {
            type: String
        }
    })],
    date: {
        type: Date,
        default: Date.now
    }
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event
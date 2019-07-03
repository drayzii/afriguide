const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    map: {
        type: String
    },
    photo: {
        type: String
    }
})

const Place = mongoose.model('Place', PlaceSchema)

module.exports = Place
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    reviewOn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review
const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    onType: {
        type: String,
        required: true
    },
    likeOn: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Like = mongoose.model('Like', LikeSchema)

module.exports = Like
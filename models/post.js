const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    postOn: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
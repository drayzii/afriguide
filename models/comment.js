const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    onType: {
        type: String,
        required: true
    },
    commentOn: {
        type: String,
        required: true
    },
    onOther: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
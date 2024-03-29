const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        dropDups: true,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: String
    },
    isAdmin: {
        type: Number,
        default: 1
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
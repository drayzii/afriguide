const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    by: {
        _id:{
            type: String,
            required: true 
        },
        name:{
            type: String,
            required: true 
        },
        photo:{
            type: String
        }
    },
    description: {
        postText: {
            type: String,
            required: true 
        },
        postPhoto:{
            type: String
        },
        date:{
            type: Date,
            default: Date.now
        }
    },
    comments: [new mongoose.Schema({
        by: {
            _id:{
                type: String,
                required: true     
            },
            name:{
                type: String,
                required: true 
            },
            photo:{
                type: String
            }
        },
        description: {
            postText: {
                type: String,
                required: true 
            },
            postPhoto:{
                type: String,
                required: true 
            },
            date:{
                type: Date,
                default: Date.now
            }
        },
    })],
    likes: [new mongoose.Schema({
        by: {
            _id:{
                type: String,
                required: true 
            },
            name:{
                type: String,
                required: true 
            },
            photo:{
                type: String
            }
        }
    })]
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
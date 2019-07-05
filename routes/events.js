const express = require('express')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const router = express.Router()
const jwt = require('jsonwebtoken')

const Place = require('../models/place')
const User = require('../models/users')
const Event = require('../models/event')

const jwtKey = require('../config/keys').jwtKey

router.get('/', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    Event.find()
    .then(result=>{
        if(result.length == 0){
            res.json({ error: 'No Events to show' })
            res.end()
        }
        else{
            res.json({
                success: true,
                data: result
            })
            res.end()
        }
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
        res.end()
    })
})

router.post('/add',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    var { placeName, placeIsKnown, name, text, time, entrance } = req.body

    if(placeIsKnown){
        const query1 = { name: placeName }
        Place
        .findOne(query1)
        .then((result1)=>{
            if(payload.id != result1.user){
                const query2 = { _id: payload.id }
                User
                .findOne(query2)
                .then((result2)=>{
                    const newEvent = new Event({
                        user: payload.id,
                        by: {
                            _id: result2._id,
                            name: result2.firstname + ' ' + result2.lastname
                        },
                        place: {
                            _id: result1._id,
                            name: placeName
                        },
                        description: {
                            name,
                            text,
                            time,
                            entrance
                        }
                    })
                    newEvent.save()
                    .then(result=>{
                        res.json({
                            success: true,
                            data: result
                        })
                        res.end()
                    })
                    .catch((err)=>{
                        res.status(500).json({ error: err })
                        res.end()
                    })
                })
                .catch(()=>{
                    res.status(500).json({ error: err })
                    res.end()
                })
            }
            else{
                const newEvent = new Event({
                    user: payload.id,
                    by: {
                        _id: result1._id,
                        name: result1.name
                    },
                    place: {
                        _id: result1._id,
                        name: result1.name
                    },
                    description: {
                        name,
                        text,
                        time,
                        entrance
                    }
                })
                newEvent.save()
                .then(result=>{
                    res.json({
                        success: true,
                        data: result
                    })
                    res.end()
                })
                .catch((err)=>{
                    res.status(500).json({ error: err })
                    res.end()
                })
            }
        })
        .catch(()=>{
            res.status(500).json({ error: err })
            res.end()
        })
    }
    else{
        const query2 = { _id: payload.id }
        User
        .findOne(query2)
        .then((result2)=>{
            const newEvent = new Event({
                user: payload.id,
                by: {
                    _id: result2._id,
                    name: result2.firstname + ' ' + result2.lastname
                },
                place: {
                    name: placeName
                },
                description: {
                    name,
                    text,
                    time,
                    entrance
                }
            })
            newEvent.save()
            .then(result=>{
                res.json({
                    success: true,
                    data: result
                })
                res.end()
            })
            .catch(()=>{
                res.status(500).json({ error: err })
                res.end()
            })
        })
        .catch(()=>{
            res.status(500).json({ error: err })
            res.end()
        })
    }

})

router.put('/:id/update',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    var { placeName, placeIsKnown, name, text, time, entrance } = req.body


    if(placeIsKnown){

        const query1 = { name: placeName }
        Place
        .findOne(query1)
        .then((result1)=>{
            const update = {
                place: {
                    _id: result1._id,
                    name: result1.name
                },
                description: {
                    name,
                    text,
                    time,
                    entrance
                }
            }
            const query = { _id: req.params.id  }
            Event
            .find(query)
            .then(result=>{
                if( result.user = payload.id ){
                    Event
                    .findOneAndUpdate(query, update, { new: true })
                    .then(results=>{
                        res.json({
                            success: true,
                            data: results
                        })
                        res.end()
                    })
                    .catch(()=>{
                        res.status(500).json({ error: 'Ooops! Something went wrong.' })
                        res.end()
                    })
                }
                else{
                    res.status(401).json({ error: 'You do not have such access' })
                    res.end()
                }
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.' })
                res.end()
            })
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.' })
            res.end()
        })
    }
    else{
        const update = {
            place: {
                name: placeName
            },
            description: {
                name,
                text,
                time,
                entrance
            }
        }
        const query = { _id: req.params.id  }
        Event
        .find(query)
        .then(result=>{
            if( result.user = payload.id ){
                Event
                .findOneAndUpdate(query, update, { new: true })
                .then(results=>{
                    res.json({
                        success: true,
                        data: results
                    })
                    res.end()
                })
                .catch(()=>{
                    res.status(500).json({ error: 'Ooops! Something went wrong.' })
                    res.end()
                })
            }
            else{
                res.status(401).json({ error: 'You do not have such access' })
                res.end()
            }
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.' })
            res.end()
        })
    }
})

router.patch('/:id/interested', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query0 = { _id: req.params.id, 'interested._id': payload.id }
    Event
    .find(query0)
    .then(result0=>{
        if(result0.length > 0){
            res.json({
                error: 'Already marked interested for this event'
            })
            res.end()
        }
        else{
            const query = { _id: payload.id }
            User
            .findOne(query)
            .then(result=>{
                var name = result.firstname + ' ' + result.lastname
                Event
                .findOneAndUpdate({ _id: req.params.id }, { $push: {
                    "interested": {
                        "_id": result._id,
                        "name": name,
                        "photo": result.photo
                    }
                } }, { new: true })
                .then(results=>{
                    res.json({
                        success: true,
                        data: results
                    })
                })
                .catch(()=>{
                    res.status(500).json({ error: 'Ooops! Something went wrong.' })
                    res.end()
                })
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.' })
                res.end()
            })
        }
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
        res.end()
    })
})

router.patch('/:id/going', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query0 = { _id: req.params.id, 'going._id': payload.id }
    Event
    .find(query0)
    .then(result0=>{
        if(result0.length > 0){
            res.json({
                error: 'Already marked going for this event'
            })
            res.end()
        }
        else{
            const query = { _id: payload.id }
            User
            .findOne(query)
            .then(result=>{
                var name = result.firstname + ' ' + result.lastname
                Event
                .findOneAndUpdate({ _id: req.params.id }, { $push: {
                    "going": {
                        "_id": result._id,
                        "name": name,
                        "photo": result.photo
                    }
                } }, { new: true })
                .then(results=>{
                    res.json({
                        success: true,
                        data: results
                    })
                })
                .catch(()=>{
                    res.status(500).json({ error: 'Ooops! Something went wrong.' })
                    res.end()
                })
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.' })
                res.end()
            })
        }
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
        res.end()
    })
})

router.delete('/:id/delete',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query = { _id: req.params.id }

    Event
    .find(query)
    .then(result=>{
        if( result.user = payload.id || payload.isAdmin > 3 ){
            Event
            .findByIdAndDelete(req.params.id)
            .then(results=>{
                res.json({
                    success: true,
                    data: results
                })
                res.end()
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.' })
                res.end()
            })
        }
        else{
            res.status(401).json({ error: 'You do not have such access' })
            res.end()
        }
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
        res.end()
    })
})

module.exports = router
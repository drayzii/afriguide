const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Place = require('../models/place')
const Owner = require('../models/owner')
const User = require('../models/users')

const jwtKey = require('../config/keys').jwtKey


router.get('/view', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    Place.find()
    .then(result=>{
        if(result.length == 0){
            res.json({ error: 'No Places to show' })
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

router.get('view/:id', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    const query = { _id: req.params.id }

    Place.find(query)
    .then(result=>{
        if(result.length == 0){
            res.json({ error: 'No Places to show' })
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

    if(payload.isAdmin >= 3){
        const { name, type, description, province, district } = req.body
        const query = {name: name, province: province, district: district}
        Place.find(query)
        .then(placeData =>{
            if(placeData.length > 0)
            {
                res.status(401).json({ error: 'The Place you are trying to register is already in our database' })
                res.end()
            }
            else{
                const newPlace = new Place({
                    user: payload.id,
                    name,
                    type,
                    description,
                    province,
                    district,
                    isApproved: true,
                    byAdmin: true
                })
                newPlace.save()
                .then(result=>{
                    res.json({
                        success: true,
                        data : result
                    })
                    res.end()
                })
                .catch(()=>{
                    res.status(500).json({ error: 'Ooops! Something went wrong.' })
                    res.end()
                })
            }
        })
    }

    if(payload.isAdmin < 3){
        const { name, type, description, province, district } = req.body
        const query = {name: name}
        Place.find(query)
        .then(placeData =>{
            if(placeData.length > 0)
            {
                res.status(401).json({ error: 'The Place you are trying to register is already in our database' })
                res.end()
            }
            else{
                const newPlace = new Place({
                    user: payload.id,
                    name,
                    type,
                    description,
                    province,
                    district
                })
                newPlace.save()
                .then(result=>{
                    const newOwner = new Owner({
                        place: result._id,
                        user: payload.id
                    })
                    newOwner.save()
                    .then(()=>{
                        res.json({
                            success: true,
                            data: result
                        })
                        res.end()
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
    }
})

router.put('/:id/update', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const { name, type, description, province, district } = req.body

    const query = { _id: req.params.id }

    const update = {
        name,
        type,
        description,
        province,
        district
    }

    Place
    .find(query)
    .then(result=>{
        if( result.user = payload.id ){
            Place
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

router.post('/:id/claim', (req, res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if(payload.isAdmin >= 3){
        res.json({ error: 'Sorry you can not own a place' })
        res.end()
    }

    if(payload.isAdmin < 3){
        const id = req.params.id
        const query = { _id: id }
        Place.findOne(query)
        .then(placeData=>{
            if(placeData.byAdmin){
                const newOwner = new Owner({
                    place: id,
                    user: payload.id,
                    oldUser: placeData.user
                })
                newOwner.save()
                .then((result)=>{
                    res.json({
                        success: true,
                        data: result
                    })
                })
                .catch((err)=>{
                    res.status(500).json({ error: err })
                    res.end()
                })
            }
            else{
                res.json({ error: 'The Place has already been claimed' })
                res.end()
            }
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.' })
            res.end()
        })
    }
})

router.get('/claims', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if( payload.isAdmin < 3 ){
        res.status(403).json({ error: 'Access is denied.' })
        res.end()
    }
    else{
        const query = { oldUser: null }
        Owner.find(query)
        .then((results)=>{
            if(results.length>0){
                res.json({
                    success: true,
                    data: results
                })
            }
            else{
                res.json({
                    success: true,
                    data: 'No Claims for approval'
                })
            }
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.' })
            res.end()
        })
    }
    
})

router.get('/claims/my-claims', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if( payload.isAdmin < 3 ){
        res.status(403).json({ error: 'Access is denied.' })
        res.end()
    }
    else{
        const query = { oldUser: payload.id }
        Owner.find(query)
        .then((results)=>{
            if(results.length>0){
                res.json({
                    success: true,
                    data: results
                })
            }
            else{
                res.json({
                    success: true,
                    data: 'No Claims for places you registered  '
                })
            }
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.' })
            res.end()
        })
    }
})

router.post('/claims/:id/approve', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if( payload.isAdmin < 3 ){
        res.status(403).json({ error: 'Access is denied.' })
        res.end()
    }
    else{
        const query = { _id: req.params.id }
        Owner.findOne(query)
        .then((result)=>{
            if(result.length == 0){
                res.status(401).json({ error: 'Wrong request' })
                res.end()
            }

            const query2 = { _id: result.place }
            Place.findOne(query2)
            .then((results2)=>{
                results2.user = result.user
                results2.isApproved = true
                results2.byAdmin = false

                results2.save()
                .then(()=>{
                    const query3 = { _id: result.user }
                    User.findOne(query3)
                    .then((results3)=>{
                        results3.isAdmin = 2

                        results3.save()
                        .then(()=>{
                            result.user = result.user
                            result.oldUser = payload.id
                            result.complete = true
                            result.save()
                            .then((results)=>{
                                res.json({
                                    success: true,
                                    data1: results,
                                    data2: results2,
                                    data3: results3
                                })
                            })
                            .catch(()=>{
                                res.status(500).json({ error: 'Ooops! Something went wrong.5' })
                                res.end()
                            })
                        })
                        .catch(()=>{
                            res.status(500).json({ error: 'Ooops! Something went wrong.1' })
                            res.end()
                        })
                    })
                    .catch(()=>{
                        res.status(500).json({ error: 'Ooops! Something went wrong.2' })
                        res.end()
                    })
                })
                .catch(()=>{
                    res.status(500).json({ error: 'Ooops! Something went wrong.3' })
                    res.end()
                })
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.4' })
                res.end()
            })
        })
        .catch(()=>{
            res.status(500).json({ error: 'Ooops! Something went wrong.6' })
            res.end()
        })
    }
})

router.delete('/:id/delete', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query = { _id: req.params.id }

    Place
    .find(query)
    .then(result=>{
        if( result.user = payload.id || payload.isAdmin > 3 ){
            Place
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

router.patch('/:id/backToAdmin', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query = { place: req.params.id }

    Owner.findOne(query)
    .then(result=>{
        if( result.user != payload.id ){
            res.json({
                error: "You do not have such access"
            })
            res.end()
        }
        else{
            Place.findOneAndUpdate(query, {
                user: result.oldUser
            }, { new: true })
            .then(result2=>{
                Owner.findOneAndUpdate(query, {
                    complete: false,
                    
                }, { new: true })
                .then(result3=>{
                    res.json({
                        success: true,
                        Placedata: result2,
                        Ownerdata: result3 
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

module.exports = router
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/users')
const Event = require('../models/event')
const Place = require('../models/place')
const Owner = require('../models/owner')
const jwt = require('jsonwebtoken')

const jwtKey = require('../config/keys').jwtKey
const jwtExpiry = 3600

router.get('/', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if( payload.isAdmin > 3 ){
        User.find()
        .then(result=>{
            if(result.length == 0){
                res.json({ error: 'No Users to show' })
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
    }
    else{
        res.status(500).json({ error: 'You do not have such access.' })
        res.end()
    }
})

router.get('/my-profile',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query = { _id: payload.id }

    User.findOne(query)
    .then(result=>{
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

router.get('/:id', (req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    if( payload.isAdmin > 3 ){

        const query = { _id: req.params.id }

        User.findOne(query)
        .then(result=>{
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
    }
    else{
        res.status(500).json({ error: 'You do not have such access.' })
        res.end()
    }
})

router.post('/signup',(req,res)=>{
    const { firstname, lastname, email, birthday, country, password, isAdmin } = req.body
    const query = {email: email}
    User.find(query)
    .then(userData =>{

        if(userData.length > 0)
        {
            res.status(401).json({ error: 'Email Address already in our database' })
            res.end()
        }
        else{
            bcrypt.hash(password, 10, (err,hash)=>{
                if(err){
                    res.status(500).json({ err: 'Ooops! Something went wrong.' })
                    res.end()
                }
                else{
                    const newUser = new User({
                        firstname,
                        lastname,
                        email,
                        birthday,
                        country,
                        password: hash,
                        isAdmin
                    })
                    newUser.save()
                    .then((result)=>{
                        const token = jwt.sign(
                        {  id: result._id, isAdmin: result.isAdmin },
                        jwtKey,
                        {
                            algorithm: 'HS256',
                            expiresIn: jwtExpiry
                        }
                        )
                        res.cookie('token', token, { maxAge: jwtExpiry * 1000 })
                        res.json({
                            success: 'true',
                            token: token,
                            data : newUser
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
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
    })
})

router.post('/login', (req,res)=>{
    const { email, password } = req.body
    const query = {email: email}
    User.find(query)
    .then(userData =>{

        if(userData.length < 1)
        {
            res.status(401).json({ error: 'Email not found' })
            res.end()
        }

        bcrypt.compare(password, userData[0].password, (err, result)=>{
            if(err){
                res.status(500).json({ error: 'Something went wrong' })
                res.end()
            }
            if(result){
                const token = jwt.sign(
                { id: userData[0]._id, isAdmin: userData[0].isAdmin },
                jwtKey,
                {
                    algorithm: 'HS256',
                    expiresIn: jwtExpiry
                }
                )
                res.cookie('token', token, { maxAge: jwtExpiry * 1000 })
                res.json({
                    success: 'true',
                    token: token,
                    data : userData[0]
                })
                res.end()
            }
            else{
                res.status(401).json({ error: 'Incorrect Password' })
                res.end()
            }
        })
    })
    .catch(err =>{
        console.log(err)
        res.json({ error: 'Invalid email'})
        res.end()
    })
})

router.put('/my-profile/update',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const { firstname, lastname, country } = req.body

    const query = { _id: payload.id }

    const update = {
        firstname,
        lastname,
        country
    }
        User
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
    
})

router.delete('/my-profile/delete',(req,res)=>{
    const token = req.cookies.token

    if(!token){
        res.status(401).json({ error: 'Log In First' })
        res.end()
    }

    var payload = jwt.verify(token, jwtKey)

    const query = { _id: payload.id }

    User
    .findOneAndDelete(query)
    .then(results=>{

        Event
        .deleteMany({ user: payload.id })
        .then(()=>{

            Place
            .deleteMany({ user: payload.id })
            .then(()=>{
                
            })
            .catch(()=>{
                res.status(500).json({ error: 'Ooops! Something went wrong.' })
                res.end()
            })

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
    })
    .catch(()=>{
        res.status(500).json({ error: 'Ooops! Something went wrong.' })
        res.end()
    })
})

module.exports = router
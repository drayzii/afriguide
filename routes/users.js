const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')

const jwtKey = require('../config/keys').jwtKey
const jwtExpiry = 3600

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

module.exports = router
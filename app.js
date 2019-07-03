const express = require('express')
const db = require('./config/keys').mongoURI
const mongoose = require('mongoose')
const usersRoute = require('./routes/users')
const app = express()
const cookieParser = require('cookie-parser')



mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connected')
    })
    .catch((err) => {
            console.log(err)
    })

app.use(express.urlencoded( {extended:true} ))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Welcome to AfriGuide')
})

app.use('/users', usersRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Up and running on port ${PORT}`)
})
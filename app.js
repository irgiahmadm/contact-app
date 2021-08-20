const express = require('express');
const expressLayout = require('express-ejs-layouts')
const { listContact, findContact } = require('./utils/contact.js')

const app = express()
const port = 3000

//use ejs view engine
app.set('view engine', 'ejs')
//set main layout
app.set('layout', 'layouts/main-layout')
//set express ejs layout
app.use(expressLayout)
//built-in middleware
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index', {
        name: 'irgi',
        title: 'Home'
    })
})

app.get('/product/:id', (req, res) => {
    res.send(`product ${req.params.id} category : ${req.query.category}`)
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    })
})

app.get('/contact', (req, res) => {
    const contacts = listContact()
    res.render('contact', {
        title: 'Contact',
        contacts
    })
})

app.get('/contact/:phoneNumber', (req, res) => {
    const contact = findContact(req.params.phoneNumber)
    res.render('detail', {
        title: 'Detail Contact',
        contact,
        phoneNumber: req.params.phoneNumber
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found')
})

app.listen(port, (req, res) => {
    console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('flash')
const {
    listContact,
    findContact,
    addContact
} = require('./utils/contact.js')
const {
    body,
    validationResult,
    check
} = require('express-validator');
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
app.use(express.urlencoded({
    extended: true
}))

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

//list contact page
app.get('/contact', (req, res) => {
    const contacts = listContact()
    res.render('contact', {
        title: 'Contact',
        contacts
    })
})

//form contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Add Contact Form'
    })
})

//add contact data
app.post('/contact', [
    check('email', 'Email is invalid').isEmail(),
    check('phoneNumber', "Phone Number is Invalid").isMobilePhone('id-ID'),
    body('phoneNumber').custom((value) => {
        const duplicate = findContact(value);
        if (duplicate) {
            throw new Error('Phone Number is exist')
        }
        return true
    })
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Form Data Contact',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        res.redirect('/contact')
    }
})

//detail contact
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
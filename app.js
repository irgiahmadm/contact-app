const express = require('express');
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const {
    listContact,
    findContact,
    addContact,
    deleteContact,
    editContact
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

//flash message config
app.use(cookieParser('secret'))
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//middleware for index
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
        contacts,
        msg: req.flash('msg')
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
        req.flash('msg', 'Contact is succesfully created!')
        res.redirect('/contact')
    }
})

app.get('/contact/delete/:phoneNumber', (req, res) => {
    const contact = findContact(req.params.phoneNumber)
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.phoneNumber)
        req.flash('msg', 'Contact is succesfully deleted!')
        res.redirect('/contact')
    }
})

//form edit contact
app.get('/contact/edit/:phoneNumber', (req, res) => {
    const contact = findContact(req.params.phoneNumber)
    res.render('edit-contact', {
        title: 'Edit Contact Form',
        contact
    })
})

app.post('/contact/edit',  [
    check('email', 'Email is invalid').isEmail(),
    check('phoneNumber', "Phone Number is Invalid").isMobilePhone('id-ID'),
    body('phoneNumber').custom((value, { req }) => {
        const duplicate = findContact(value);
        if (value !== req.body.oldPhoneNumber && duplicate) {
            throw new Error('Phone Number is exist')
        }
        return true
    })
],(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Form Edit Data Contact',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        editContact(req.body)
        req.flash('msg', 'Contact is succesfully updated!')
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
const express = require('express');
const expressLayout = require('express-ejs-layouts')
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
    const mahasiswa = [{
            nim: '6706180041',
            name: 'Irgi Ahmad M1'
        },
        {
            nim: '6706180041',
            name: 'Irgi Ahmad M2'
        },
        {
            nim: '6706180041',
            name: 'Irgi Ahmad M3'
        }
    ]

    res.render('index', {
        name: 'irgi',
        title: 'Home',
        mahasiswa,
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
    res.render('contact', {
        title: 'About',
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found')
})

app.listen(port, (req, res) => {
    console.log(`Example app listening at http://localhost:${port}`)
})
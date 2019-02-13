const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(require('cors')())
    .use(require('body-parser').json())
    .use(require('./routes'))
    .get('/', (req, res) => res.render('public/index'))
    .listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
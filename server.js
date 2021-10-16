const express = require('express')
const mongoose = require('mongoose')
const ShortUrls = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrls.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrls.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrls', async (req, res) => {
  const shortUrl = await ShortUrls.findOne({ short: req.params.shortUrls })

  if(shortUrl == null ){
    return res.sendStatus(404)
  } else {
      shortUrl.clicks++
      shortUrl.save()
  }

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 4000)
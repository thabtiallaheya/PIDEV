'use strict'

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const ACTIVITY = require('./models/Activity')
const cors = require('cors')
const { update } = require('./models/Activity')
const bodyParser = require('body-parser')
const app = express()
const fileRoutes = require('./routes/fileUploadRoutes')
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', fileRoutes.routes)
mongoose.connect(
  'mongodb+srv://Firas:qs2DNSfxzNVgWzT5@pidev.rwjs1.mongodb.net/PIDEV?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  },
)

/*app.post('/insert', async (req, res) => {
  const title = req.body.title
  const file = req.body.file
  //multipleFileUpload
  const creationDate = req.body.creationDate
  const limiteDate = req.body.limiteDate
  const activity = new ACTIVITY({
    title: title,
    file: file,
    creationDate: creationDate,
    limiteDate: limiteDate,
  })
  try {
    await activity.save()
    res.send('INSERTED DATA')
  } catch (err) {
    console.log(err)
  }
})

app.get('/read', async (req, res) => {
  ACTIVITY.find({}, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.send(result)
  })
})
app.get('/read/detail/:id', (req, res) => {
  const id = req.params.id
  ACTIVITY.findById(id, function (err, activity) {
    if (err) return res.json({ sucess: false, error: err })

    return res.json({ sucess: true, activity })
  })
})

app.put('/update/:id', (req, res) => {
  ACTIVITY.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, post) => {
      if (err) return res.status(400).json({ sucess: false, err })
      return res.status(200).json({ sucess: true })
    },
  )
})

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  await ACTIVITY.findByIdAndRemove(id).exec()
  res.send('deleted')
})*/

app.listen(3001, () => {
  console.log('app is running in port 3001')
})

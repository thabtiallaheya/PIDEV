const express = require('express')

const multer = require('multer')

const path = require('path')

const fs = require('fs')

const router = express.Router()

const trainingModule = require('../models/training')
const UserModule = require('../models/user')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if (mimeType && extname) {
      return cb(null, true)
    }
    cb('Give proper files format to upload')
  },
}).single('image')

//GET ALL
router.get('/training/getAll', async (req, res) => {
  try {
    const data = await trainingModule.find()

    const sortedData = data.sort((a, b) => b.creationDate - a.creationDate)
    res.json(sortedData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//GET ONE BY ID
router.get('/training/getOne/:id', async (req, res) => {
  try {
    const data = await trainingModule.findById(req.params.id)
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//POST API
router.post('/training/insert', upload, async (req, res) => {
  const data = new trainingModule({
    name: req.body.name,
    description: req.body.description,
    tag: req.body.tag,
    creationDate: new Date(),
    duration: req.body.duration,
    language: req.body.language,
    scheduledDate: req.body.scheduledDate,
    nbrParticipent: req.body.nbrParticipent,
    image: req.file.filename,
    price: req.body.price,
    status: req.body.status,
    trainer: req.body.trainer,
  })
  try {
    const dataToSave = await data.save()
    res.status(200).json(dataToSave)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
//PUT API
router.put('/training/update/:id', upload, async (req, res) => {
  try {
    const data = await trainingModule.findById(req.params.id)
    let newImage = ''
    if (req.file) {
      newImage = req.file.filename
      try {
        fs.unlinkSync('./images/' + data.image)
        //file removed
      } catch (err) {
        console.error(err)
      }
    } else {
      newImage = data.image
    }
    const options = { new: true }
    const result = await trainingModule.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        tag: req.body.tag,
        creationDate: data.creationDate,
        duration: req.body.duration,
        language: req.body.language,
        scheduledDate: req.body.scheduledDate,
        nbrParticipent: req.body.nbrParticipent,
        image: newImage,
        price: req.body.price,
        trainer: req.body.trainer,
      },
      options,
    )
    res.send(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//DELET API
router.delete('/training/delete/:id', async (req, res) => {
  try {
    const data = await trainingModule.findById(req.params.id)
    //console.log(data.image);
    try {
      fs.unlinkSync('./images/' + data.image)
      //file removed
    } catch (err) {
      console.error(err)
    }
    await trainingModule.findByIdAndDelete(req.params.id)
    res.send(`${req.params.id} has been Deleted`)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
module.exports = router
// trainings by user
router.get('/trainings/user/:id', async (req, res) => {
  try {
    const data = await trainingModule.find({ trainer: req.params.id })
    const sortedData = data.sort((a, b) => b.creationDate - a.creationDate)
    res.json(sortedData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

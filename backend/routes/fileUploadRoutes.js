'use strict'
const express = require('express')
const { upload } = require('../helpres/file')
const {
  multipleFileUpload,
  singleFileUpload,
  getallMultipleFiles,
  getMultipleFilesById,
  deleteFilesById,
  updateFilesById,
  //downloadFilesById,
} = require('../controllers/fileUploader')
const router = express.Router()
router.post('/singleFile', upload.single('file'), singleFileUpload)
router.post('/multipleFiles', upload.array('file'), multipleFileUpload)

router.get('/getMultipleFiles', getallMultipleFiles)
router.get('/read/detail/:id', getMultipleFilesById)
router.delete('/delete/:id', deleteFilesById)
router.put('/update/:id', updateFilesById)
//router.get('/:id/download', downloadFilesById)

module.exports = {
  routes: router,
}

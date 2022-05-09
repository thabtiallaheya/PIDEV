const mongoose = require('mongoose')
const Schema = mongoose.Schema
const multipleFileSchema = new Schema(
  {
    subject: {
      type: String,
    },
    title: {
      type: String,
    },
    file: [Object],
    limiteDate: {
      type: Date,
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('MultipleFile', multipleFileSchema)

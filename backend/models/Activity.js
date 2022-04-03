'use strict'
const mongoose = require('mongoose')
const ACTIVITYSchema = new mongoose.Schema(
  {
    //AssigmentId: {}
    title: {
      type: String,
    },
    file: {
      type: String,
    },
    /*file: [Object],*/
    creationDate: {
      type: Date,
    },
    limiteDate: {
      type: Date,
    },
  },
  //{ timestamps: true },
)
const PIDEV = mongoose.model('ACTIVITY', ACTIVITYSchema)
module.exports = PIDEV

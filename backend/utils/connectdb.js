const mongoose = require("mongoose")
const url = process.env.MONGO_DB_CONNECTION_STRING
const connect = mongoose.connect(url)
connect
  .then(db => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  })
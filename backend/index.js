const express = require('express');
const app = express();
const mongoose = require("mongoose");
app.use(express.json())
mongoose.connect("mongodb+srv://Firas:qs2DNSfxzNVgWzT5@pidev.rwjs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true })
app.listen(8000, ()=> {
    console.log('app is running in port 8000')
})  
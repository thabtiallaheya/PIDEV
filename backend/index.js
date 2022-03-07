const express = require('express');
const mongoose = require("mongoose");
const PIDEV = require('./models/PIDEV');
const app = express();

app.use(express.json())
mongoose.connect("mongodb+srv://Firas:qs2DNSfxzNVgWzT5@pidev.rwjs1.mongodb.net/PIDEV?retryWrites=true&w=majority", {useNewUrlParser: true })

app.get('/',async(req,res)=>{
const activity = new PIDEV({title:"act",file:"file.txt",creationDate:"2022-06-21",limitDate:"2022-06-22"})
try{
    await activity.save();
    res.send('INSERTED DATA');
} catch(err){
    console.log(err)
}


});

app.listen(3000, ()=> {
    console.log('app is running in port 3000')
})  
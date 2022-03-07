const mongoose = require('mongoose')
const PIDEVSchema = new mongoose.Schema({
    //AssigmentId: {}
    title :{
        type:String 
    },
    file : {
        type : String
    },
    creationDate : { 
        type : Date 
    },
    limiteDate : {
        type : Date 
    },

});
const PIDEV = mongoose.model("PIDEV",PIDEVSchema)
module.exports = PIDEV;
const mongoose = require('mongoose')

const evenementSchema = mongoose.Schema({
    type:String, 
    nom:String, 
    effet:{},
    reputation:Number, 
    prix:Number
    
})

const EvenementModel = mongoose.model('user', evenementSchema)

module.exports = EvenementModel

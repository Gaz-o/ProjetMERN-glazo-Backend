const mongoose = require('mongoose')

const equipementSchema = mongoose.Schema({
    type:String, 
    nom:String, 
    effet:{}, 
    placement:String, 
    reputation:Number, 
    prix:Number
    
})

const EquipementModel = mongoose.model('user', equipementSchema)

module.exports = EquipementModel

const mongoose = require('mongoose')

const personnageSchema = mongoose.Schema({
    proprietaire:String, 
    pseudoPersonnage:String, 
    visuel:String, 
    stats:{
        for:Number, 
        def:Number, 
        agi:Number, 
        pv:Number,
        reste:Number}, 
    bio:String, 
    equipements:{
        tete:String, 
        torse:String, 
        jambe:String, 
        mainGauche:String, 
        mainDroit:String},
    reputation:Number,
    argent:Number
})

const PersonnageModel = mongoose.model('personnage', personnageSchema)

module.exports = PersonnageModel

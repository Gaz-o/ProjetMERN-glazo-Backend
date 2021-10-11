const mongoose = require('mongoose')

const personnageSchema = mongoose.Schema({
    proprietaire:userId, 
    pseudoPersonnage:String, 
    visuel:String, 
    stats:{
        for:Number, 
        def:Number, 
        agi:Number, 
        pv:Number}, 
    bio:String, 
    equipements:{
        tete:equipementId, 
        torse:equipementId, 
        jambe:equipementId, 
        mainGauche:equipementId, 
        mainDroit:equipementId},
    reputation:Number,
    argent:Number
})

const PersonnageModel = mongoose.model('user', personnageSchema)

module.exports = PersonnageModel

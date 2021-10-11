var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Utilisateur = require('../models/utilisateur');
//const Evenement = require('./models/evenement');
//const Personnage = require('./models/personnage');
//const Equipement = require('./models/equipement');

const DB_URI = "mongodb://localhost:27017/glazo"

mongoose.connect(DB_URI).then(() => console.log('DB OK'))


router.post('/add', function(req, res, next) {
  console.log(req.body);
  Utilisateur.find({mail:req.body.mail}).then(Utilisateurs => {
    console.log(Utilisateurs.length);
    if (Utilisateurs.length < 1) {
      mongoose.connect(DB_URI).then(() => {
        console.log('*** CONNECTED TO DB ***')
        Utilisateur.insertMany(req.body).then(() => 
          res.send({success:true, message:"Ok"})).catch(console.log)
      })
    } else {
      res.send({success:false, message:"Pas Ok"})
    }
  })
});

module.exports = router;
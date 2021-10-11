var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');

const Utilisateur = require('../models/utilisateur');
//const Evenement = require('./models/evenement');
//const Personnage = require('./models/personnage');
//const Equipement = require('./models/equipement');

const DB_URI = "mongodb://localhost:27017/glazo"

mongoose.connect(DB_URI).then(() => console.log('DB OK'))

const jwt = require('jsonwebtoken');


router.post('/add', function(req, res, next) {
  
  if (!req.body.mail || !req.body.pseudo || !req.body.password) {
    return res.send({success:false, message:"Manque un champs"})
  } else {

    let body = {
      password:bcrypt.hashSync(req.body.password, saltRounds),
      mail:req.body.mail,
      pseudo:req.body.pseudo
    }
    
    Utilisateur.find({pseudo:req.body.pseudo}).then((UtilisateurPseudo) => {
      if (UtilisateurPseudo.length > 0) {
        return res.send({success:false, message:"Pseudo deja existant"})
      } else {
        Utilisateur.find({mail:req.body.mail}).then(UtilisateursMail => {
          if (UtilisateursMail.length < 1) {
            mongoose.connect(DB_URI).then(() => {
              Utilisateur.insertMany(body).then(() => 
                res.send({success:true, message:"Ok"})).catch(console.log)
            })
          } else {
            res.send({success:false, message:"Mail deja existant"})
          }
        })
      }
    })
  }
});

router.post('/login', function(req, res, next) {

  if (!req.body.mail || !req.body.password) {
    return res.send({success:false, message:"Manque un champs"})
  } else {
    Utilisateur.find({mail:req.body.mail}).then(Utilisateur => {
      if (Utilisateur.length === 1) {
        let itsOk = bcrypt.compareSync(req.body.password, Utilisateur[0].password);
        console.log(itsOk);
        if (itsOk === true) {
          const token = jwt.sign({
            userId: user._id
          }, 'secret', { expiresIn: "24h" });
          res.send("connexion ok")
        } else {
          res.send("erreur password")
        }
      } else {
        res.send("erreur adress mail")
      }
    })
  }
})

module.exports = router;
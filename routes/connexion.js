var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Utilisateur = require("../models/utilisateur");
//const Evenement = require('./models/evenement');
//const Personnage = require('./models/personnage');
//const Equipement = require('./models/equipement');

const jwt = require("jsonwebtoken");

router.post("/add", function (req, res, next) {
  if (!req.body.mail || !req.body.pseudo || !req.body.password) {
    return res
      .status(400)
      .send({ success: false, message: "Manque un champs" });
  } else {
    let body = {
      password: bcrypt.hashSync(req.body.password, saltRounds),
      mail: req.body.mail,
      pseudo: req.body.pseudo,
    };

    Utilisateur.find({ pseudo: req.body.pseudo }).then((UtilisateurPseudo) => {
      if (UtilisateurPseudo.length > 0) {
        return res
          .status(400)
          .send({ success: false, message: "Pseudo deja existant" });
      } else {
        Utilisateur.find({ mail: req.body.mail }).then((UtilisateursMail) => {
          if (UtilisateursMail.length < 1) {
            Utilisateur.insertMany(body)
              .then(() =>
                res.status(200).send({ success: true, message: "Ok" })
              )
              .catch(console.log);
          } else {
            res
              .status(400)
              .send({ success: false, message: "Mail deja existant" });
          }
        });
      }
    });
  }
});

router.post("/login", function (req, res, next) {
  if (!req.body.mail || !req.body.password) {
    return res
      .status(400)
      .send({ success: false, message: "Manque un champs" });
  } else {
    Utilisateur.find({ mail: req.body.mail }).then((Utilisateur) => {
      if (Utilisateur.length === 1) {
        let itsOk = bcrypt.compareSync(
          req.body.password,
          Utilisateur[0].password
        );
        console.log(itsOk);
        if (itsOk === true) {
          const token = jwt.sign(
            {
              userId: Utilisateur[0]._id,
            },
            "secret",
            { expiresIn: "24h" }
          );
          res.status(200).send({ success: true, message: "Ok", token: token });
        } else {
          res.status(400).send({ success: false, message: "erreur password" });
        }
      } else {
        res.status(400).send({ success: false, message: "erreur adress mail" });
      }
    });
  }
});

router.get("/info", function (req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).send("auth pas ok");
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(403).send("token pas ok");
  }
  // Here i decode the token
  const decodedToken = jwt.verify(token, 'secret');
  console.log(decodedToken);
  Utilisateur.find({_id: decodedToken.userId}).then((UtilisateurId) => {
    res.send({ success: true, message:"ça marche", data:UtilisateurId})
  })
}); 


router.get("/logout", function (req, res, next) {
  res.status(200).send({ success: true, message: "Déconnection" });
});

router.put("/edit", function (req, res, next) {
  console.log(req.body, "test");
  Utilisateur
    .updateOne(
      { _id: req.body._id }, //filtre
        {
          pseudo:req.body.pseudo, //a changer
          age:req.body.age,
          genre:req.body.genre,
          bio:req.body.bio
        }
    )
    .then((obj) => {
      console.log('Updated - OK');
      res.status(200).send({ success: true, message: "Modification" });
    })
    .catch((err) => {
      console.log('Error: ' + err);
    })
})
module.exports = router;

var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Utilisateur = require("../models/utilisateur");
const Controller = require("../outils/connexion");
const pR = require("../repositories/personnageRepository");

const jwt = require("jsonwebtoken");

router.post("/add", async function (req, res) {
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
    let result = await pR.exist("utilisateur", "pseudo", req.body.pseudo);
    if (result) {
      return res
        .status(400)
        .send({ success: false, message: "Pseudo deja existant" });
    } else {
      let result = await pR.exist("utilisateur", "mail", req.body.mail);
      if (!result) {
        Utilisateur.insertMany(body)
          .then(() => res.send({ success: true, message: "Ok" }))
          .catch(console.log);
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Mail deja existant" });
      }
    }
  }
});

router.post("/login", function (req, res, next) {
  if (!req.body.mail || !req.body.password) {
    return res
      .status(400)
      .send({ success: false, message: "Manque un champs" });
  }
  Utilisateur.find({ mail: req.body.mail }).then((Utilisateur) => {
    if (Utilisateur.length === 1) {
      let itsOk = bcrypt.compareSync(
        req.body.password,
        Utilisateur[0].password
      );

      if (itsOk) {
        const token = jwt.sign(
          {
            userId: Utilisateur[0]._id,
            userName: Utilisateur[0].pseudo,
          },
          "secret",
          { expiresIn: "24h" }
        );
        return res.send({ success: true, message: "Ok", token: token });
      }
      return res
        .status(400)
        .send({ success: false, message: "erreur password" });
    }
    return res
      .status(400)
      .send({ success: false, message: "erreur adress mail" });
  });
});

router.get("/info", function (req, res, next) {
  const decodedToken = jwt.verify(Controller.controlToken(req, res), "secret");
  Utilisateur.find({ _id: decodedToken.userId }).then((UtilisateurId) => {
    res.send({ success: true, message: "ça marche", data: UtilisateurId });
  });
});

router.get("/logout", function (req, res, next) {
  res.send({ success: true, message: "Déconnection" });
});

router.put("/edit", function (req, res, next) {
  Utilisateur.updateOne(
    { _id: req.body._id }, //filtre
    {
      pseudo: req.body.pseudo, //a changer
      age: req.body.age,
      genre: req.body.genre,
      bio: req.body.bio,
    }
  )
    .then(function () {
      res.send({ success: true, message: "Modification" });
    })
    .catch(function () {
      res.status(400).send({ success: false, message: "Erreur modification" });
    });
});

router.delete("/delete", function (req, res, next) {
  console.log(req.body, "here");
  Utilisateur.deleteOne({ _id: req.body._id })
    .then(function () {
      res.send({ success: true, message: "Suppression Ok" });
    })
    .catch(function () {
      res.status(400).send({ success: false, message: "Erreur suppression" });
    });
});

module.exports = router;

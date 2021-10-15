var express = require("express");
var router = express.Router();

const Personnage = require("../models/personnage");
const Controller = require("../outils/connexion");

const jwt = require("jsonwebtoken");

router.post("/add", function (req, res) {
  const decodedToken = jwt.verify(Controller.controlToken(req, res), "secret");
  let body = { ...req.body, proprietaire: decodedToken.userName };
  if (
    req.body.pseudoPersonnage !== "" &&
    req.body.bio !== "" &&
    req.body.stats["reste"] === 0
  ) {
    Personnage.insertMany(body)
      .then(() => res.send({ success: true, message: "Ok" }))
      .catch(console.log);
    console.log("Dans personnage add");
  }
});

router.get("/personnageactif", function (req, res, next) {
  let token = Controller.controlToken(req, res);
  const decodedToken = jwt.verify(token, "secret");
  Personnage.findOne({
    proprietaire: decodedToken.userName,
    vie: { $gt: 0 },
  }).then((combattant) => {
    if (combattant !== null) {
      res.send({
        success: true,
        message: "Votre combattant",
        data: combattant,
      });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Plus de combattant actif" });
    }
  });
});

router.put("/congedier", function (req, res, next) {
  console.log(req.body.proprietaire, "truc");
  Personnage.updateOne(
    { proprietaire: req.body.proprietaire, vie: { $gt: 0 } }, //filtre
    { vie: 0 }
  )
    .then(function () {
      res.send({ success: true, message: "Combattant congedier" });
    })
    .catch(function () {
      res
        .status(400)
        .send({ success: false, message: "Plus de combattant actif" });
    });
});

router.get("/famepersonnages", function (req, res, next) {
  Personnage.find({ vie: 0 })
    .sort({ reputation: "desc" })
    .limit(5)
    .then((combattants) => {
      if (combattants !== null) {
        res.send({
          success: true,
          message: "Votre combattant",
          data: combattants,
        });
      } else {
        res
          .status(400)
          .send({ success: false, message: "pas de combattant a afficher" });
      }
    });
});

module.exports = router;

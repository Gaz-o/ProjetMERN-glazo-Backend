var express = require("express");
var router = express.Router();

const Personnage = require("../models/personnage");
const Controller = require("../controler/connexion");

const jwt = require("jsonwebtoken");

//const Evenement = require('./models/evenement');
//const Equipement = require('./models/equipement');

router.post("/add", function (req, res) {
  const decodedToken = jwt.verify(Controller.controlToken(req, res), "secret");
  let body = { ...req.body, proprietaire: decodedToken.userId };
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
  let token = Controller.controlToken(req, res)
  const decodedToken = jwt.verify(token, "secret");
  Personnage.findOne({proprietaire: decodedToken.userId, vie:{$gt:0}}).then((combattant) => {
    if (combattant !== null) {
      res.send({ success:true, message:"Votre combattant", data:combattant})
    } else {
      res.status(400).send({ success:false, message:"Plus de combattant actif"})
    }
  })
});

router.put("/edit", function (req, res, next) {});

router.delete("/delete", function (req, res, next) {});

module.exports = router;

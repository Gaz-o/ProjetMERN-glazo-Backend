var express = require("express");
var router = express.Router();

const Personnage = require("../models/personnage");
const outils = require("../outils/connexion");
const pR = require("../repositories/personnageRepository");

const jwt = require("jsonwebtoken");

router.put("/post", async function (req, res) {
  const decodedToken = jwt.verify(outils.controlToken(req, res), "secret");
  let result = await pR.exist(Personnage, "_id", req.body._id);
  if (!result) {
    return res
      .status(400)
      .send({ success: false, message: "Commentaire deja existant" });
  }
  pR
    .addCommentaire(req.body._id, {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      commentaire: req.body.message,
    })
    .then(() =>
      res.status(200).send({ success: true, message: "Commentaire rajouté" })
    )
    .catch(console.log);
});

router.get("/view", function (req, res) {});
module.exports = router;

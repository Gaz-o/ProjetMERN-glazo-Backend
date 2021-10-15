var express = require("express");
var router = express.Router();

const Personnage = require("../models/personnage");
const outils = require("../outils/connexion");
const personnageRepository = require("../repositories/personnageRepository");

const jwt = require("jsonwebtoken");

router.put("/post", async function (req, res) {
  const decodedToken = jwt.verify(outils.controlToken(req, res), "secret");
  let id = req.body._id
  let result = await personnageRepository.exist(id);
  if (!result) {
    return res
      .status(400)
      .send({ success: false, message: "Commentaire deja existant" });
  }
    personnageRepository.addCommentaire(req.body._id, {
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

/* Utilisateur.find({ pseudo: req.body.pseudo }).then((UtilisateurPseudo) => {
      if (UtilisateurPseudo.length > 0) {
        return res
          .status(400)
          .send({ success: false, message: "Pseudo deja existant" });
      } else {
        Utilisateur.find({ mail: req.body.mail }).then((UtilisateursMail) => {
          if (UtilisateursMail.length < 1) {
            Utilisateur.insertMany(body)
              .then(() => res.send({ success: true, message: "Ok" }))
              .catch(console.log);
          } else {
            return res
              .status(400)
              .send({ success: false, message: "Mail deja existant" });
          }
        });
      }
    });
 */

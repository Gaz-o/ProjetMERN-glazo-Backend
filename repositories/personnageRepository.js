const Personnage = require("../models/personnage");

function addCommentaire(id, message) {
  return Personnage.updateOne(
    { _id: id },
    {
      $push: {
        messages: {
          _id: message.userId, //a changer
          name: message.userName,
          commentaire: message.commentaire,
        },
      },
    }
  );
}

function exist(id) {
  let personnage = Personnage.find({ _id: id }).then();
  if ((personnage.length = 1)) {
    return true;
  }
  return false;
}

module.exports = {
  addCommentaire,
  exist
};

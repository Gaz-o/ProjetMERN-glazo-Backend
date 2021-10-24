const Personnage = require("../models/personnage");
const Utilisateur = require("../models/utilisateur");

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

function exist(collection, target, id) {
  const Model = require(`../models/${collection}`);
  let queryParam = {};
  queryParam[target] = id;
  return Model.find(queryParam).then((data) => {
    if (data.length > 0) {
      return true;
    }
    return false;
  });
}

module.exports = {
  addCommentaire,
  exist,
};

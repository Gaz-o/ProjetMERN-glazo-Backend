const mongoose = require("mongoose");

const commentaireSchema = mongoose.Schema({
  _id: String,
  name: String,
  commentaire: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "like" }],
});

const CommentaireModel = mongoose.model("commentaire", commentaireSchema);

module.exports = CommentaireModel;

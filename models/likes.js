const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    _id:String,
    name:String,
    like:String
})

const LikesModel = mongoose.model('like', likeSchema)

module.exports = LikesModel
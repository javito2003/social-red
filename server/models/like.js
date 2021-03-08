const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    like: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Like = mongoose.model('Like', likeSchema)

module.exports = Like
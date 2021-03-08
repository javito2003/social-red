const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    photo: String,
    description: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'Likes'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
})

const Post = mongoose.model('Post',postSchema )

module.exports = Post
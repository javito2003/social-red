const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    password: {type: String, required:true},
    date: {type: Date, default: Date.now()},
    address: {type: Schema.Types.ObjectId, ref: "Address"},
    photo: {type: String}
})

userSchema.plugin(uniqueValidator, {MESSAGE: 'Error, expected {PATH} to be unique'})
userSchema.methods.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

const User = mongoose.model('User',userSchema)

module.exports = User

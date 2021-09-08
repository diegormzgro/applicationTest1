const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: ''
    },
    

})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true,
})

const User = mongoose.model('user', userSchema)

module.exports = User
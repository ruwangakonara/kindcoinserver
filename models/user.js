const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
        
        
    },
    status: String
})

const User = mongoose.model('User', userSchema)

module.exports = User
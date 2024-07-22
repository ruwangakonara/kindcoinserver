const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const noteSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },

    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    created:{
        type: Date,
        default: Date.now
    }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
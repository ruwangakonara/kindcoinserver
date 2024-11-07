const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    beneficiary_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
        required: true
    },

    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    type:{
        type: String,
        required: true
    },

    created:{
        type: Date,
        default: Date.now
    },

    open:{
        type: Boolean,
        default: true
    },

    verified:{
        type: Boolean,
        default: false
    },
    image1: {
        type: String,
        default: 'https://via.placeholder.com/300',
        required: true
    },

    image2: {
        type: String,
        default: 'https://via.placeholder.com/300',
        required: true
    },

    image3: {
        type: String,
        default: 'https://via.placeholder.com/300',
        required: true
    },
    certificate_image: {
        type: String,
        default: 'https://via.placeholder.com/300'
    },

    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        default:""
    },
    phone:{
        type: String,
        default:""

    },
    raised:{
        type: Number,
        default:0
    }
})

const Request = mongoose.model("Request", requestSchema);
module.exports = Request
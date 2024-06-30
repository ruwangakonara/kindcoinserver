const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    donor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
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

    accepted:{
        type: Boolean,
        default: false
    },

    goods:{
        type:mongoose.Schema.Types.Mixed
    },

    verified:{
        type: Boolean,
        default: false
    },

    rewarded:{
        type: Boolean,
        default: false
    },

    value:{
        type: Number,
    },

    images: {
        type: [String],
        default: []
    },
    name: {
        type: String,
        required: true
    },

    email:{
        type: String,
    }
})

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation
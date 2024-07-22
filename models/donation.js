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

    request_id:{
      type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Request"
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
    },

    doc_obtained:{
        type:Boolean,
        default: false
    },

    doc_paid:{
        type:Boolean,
        default: false
    },

    token_amount:{
        type: Number,
   },

    xlmToLkrRate:{
        type: Number,
    },

    tokenToXlmRate:{
        type: Number,
    },

    donation_date:{
        type: Date,
    }
})

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation
const mongoose = require("mongoose")

const goodSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

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

    beneficiary_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Beneficiary"
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

    goods: [goodSchema],

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
    // name: {
    //     type: String,
    //     required: true
    // },

    email:{
        type: String,
    },

    doc_transac_id:{
        type:String,
        default:""
    },

    doc_verified:{
        type:Boolean,
        default: false
    },

    token_amount:{
        type: Number,
   },

    doc_token_amount:{
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
    },
    attest_obtained:{
        type: Boolean,
        default: false
    }
})

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation
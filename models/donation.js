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
    
    status: {
        type: String,
        enum: ['Pending', 'Published', 'Rejected'],
        default: 'Pending'
    },

    rewarded:{
        type: Boolean,
        default: false
    },

    value:{
        type: Number,
        default: 0
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
        default:"Not Entered Yet"
    },

    doc_verified:{
        type:Boolean,
        required:true,
        default: false
    },

    token_amount:{
        type: Number,
        default: 0
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
    image4: {
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    phone:{
        type: String,
        default:""
    },
    member_id:{
        type: mongoose.Types.ObjectId,
        ref: "Member"
    },
    attestation_fee:{
        type: Number,
        default:0
    },

    usage_image1:{
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    usage_image2:{
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    usage_image3:{
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    usage_image4:{
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    usage_image5:{
        type: String,
        default: 'https://via.placeholder.com/300'
    },

    usage_description:{
        type:String,
        default: ""
    },

    edited:{
        type: Date,
        default: Date.now
    },

    donor_satisfied:{
        type: Boolean,
        default:true
    },

    donor_ticket_id:{
        type: mongoose.Types.ObjectId,
        ref: "Ticket"
    },

    profit:{
        type: Number,
        default:0
    }

})

donationSchema.pre('save', function (next) {
    this.attestation_fee = this.token_amount / 4;
    next();
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation
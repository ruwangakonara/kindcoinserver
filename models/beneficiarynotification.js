const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiaryNotificationSchema = new Schema({
    donor_id:  {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },

    title: {
        type: String,
        required: true
    },
    // description: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    request_id: {
        type: mongoose.Types.ObjectId,
       ref: 'Request',
        required: true
    },

    donation_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Donation',
        required: true
    },

    viewed: {
        type:Boolean,
        default: false
    },
    // address: {
    //     type: String,
    //     // required: true
    // },
    // images: {
    //     type: [String],
    //     default: []
    // },
    // profile_image: {
    //     type: String,
    //     default: 'https://via.placeholder.com/150'
    // },
    // description: {
    //     type: String,
    //     // required: true
    // },
    // type: {
    //     type: String,
    //     // enum: ['organization', 'individual'],
    //     required: true
    // },
    // date_of_birth: {
    //     type: Date,
    //     // required: true
    // },
    //
    // stellar_address:{
    //     type: String
    // },
    //
    // district:{
    //     type: String
    // },

    created_at: {
        type: Date,
        default: Date.now
    },
    beneficiary_id: {
        type: mongoose.Types.ObjectId,
        ref: "Beneficiary",
        required: true
    },
    // usual_donations:{
    //     type:[String]
    // },
    // donated:{
    //     type:Number,
    //     default:0
    // },
    // tokens:{
    //     type:Number,
    //     default:0
    // }
    // // updated_at: {
    //     type: Date,
    //     default: Date.now
    // }
});

const BeneficiaryNotification = mongoose.model('BeneficiaryNotification', beneficiaryNotificationSchema);

module.exports = BeneficiaryNotification;

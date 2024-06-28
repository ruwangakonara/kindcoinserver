const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficairySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        // required: true
    },
    images: {
        type: [String],
        default: []
    },
    profile_image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    certificate_image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    description: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        // enum: ['organization', 'individual'],
        required: true
    },
    date_of_birth: {
        type: Date,
        // required: true
    },

    district:{
        type: String
    },


    created_at: {
        type: Date,
        default: Date.now
    },

    phoneNo: {
        type: String,
        required: true
    }
    // updated_at: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Beneficiary = mongoose.model('Beneficiary', beneficairySchema);

module.exports = Beneficiary;
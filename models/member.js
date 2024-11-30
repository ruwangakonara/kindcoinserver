const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
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
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // address: {
    //     type: String,
    //     // required: true
    // },
    // images: {
    //     type: [String],
    //     default: []
    // },
    profile_image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    description: {
        type: String,
        default: ""
    },
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
    phone: {
        type: String,
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

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;

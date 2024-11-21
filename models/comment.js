const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    donor_id:{
        type: mongoose.Types.ObjectId,
        ref: "Donor",
        required: true
    },

    beneficiary_id:{
        type: Schema.Types.ObjectId,
        ref: 'Beneficiary',
        required: true
    },

    // name:{
    //     type: String,
    //     required: true
    // },

    body:{
        type: String,
        required: true
    }

})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

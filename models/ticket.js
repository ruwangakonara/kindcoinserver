const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const ticketSchema = new mongoose.Schema({

    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true,
    },

    created:{
        type: Date,
        default: Date.now
    },

    archived:{
        type:Boolean,
        default: false
    },


})

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket
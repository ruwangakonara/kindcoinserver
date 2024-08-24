const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    body:{
        type: String,
        required: true,
    },

    donor:{
        type: Boolean,
        default: false
    },
    beneficiary:{
        type:Boolean,
        default: false
    },
    created:{
        type: Date,
        default: Date.now
    }
})

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement
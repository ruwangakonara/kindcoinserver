const mongoose = require("mongoose")

const maintenanceSchema = new mongoose.Schema({
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

    name:{
        type: String,
        required: true
    },
    amount:{
        type:Number,
        required: true
    },
    created:{
        type: Date,
        default: Date.now
    }

})

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = Maintenance
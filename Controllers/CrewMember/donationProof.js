const Donation = require("../models/donation");

// Fetch all requests
async function getAllDonations(req, res) {
    try {
        const donations = await Donation.find().populate('user_id').populate('beneficiary_id');
        res.status(200).json({ donations });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update request status
async function updateDonationStatus(req, res) {
    try {
        const { docId, status } = req.body;
        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const updatedDonation = await Request.findByIdAndUpdate(docId, { status }, { new: true });
        res.status(200).json({ request: updatedDonation });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAllDonations,
    updateDonationStatus
};
const Recepients = require("../models/beneficiary");

// Fetch all requests
async function getAllBeneficiaries(req, res) {
    try {
        const benificiaries= await Recepients.find().populate('user_id').populate('beneficiary_id');
        res.status(200).json({ benificiaries });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update request status
async function updateBeneficiaryStatus(req, res) {
    try {
        const { nic, status } = req.body;
        if (!['Pending', 'Acceptped', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const updatedBeneficiary = await Recepients.findByIdAndUpdate(nic, { status }, { new: true });
        res.status(200).json({ request:  updatedBeneficiary });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAllBeneficiaries,
    updateBeneficiaryStatus
};
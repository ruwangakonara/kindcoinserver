const Request = require("../models/request");

// Fetch all requests
async function getAllRequests(req, res) {
    try {
        const requests = await Request.find().populate('user_id').populate('beneficiary_id');
        res.status(200).json({ requests });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update request status
async function updateRequestStatus(req, res) {
    try {
        const { requestId, status } = req.body;
        if (!['Pending', 'Published', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const updatedRequest = await Request.findByIdAndUpdate(requestId, { status }, { new: true });
        res.status(200).json({ request: updatedRequest });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAllRequests,
    updateRequestStatus
};
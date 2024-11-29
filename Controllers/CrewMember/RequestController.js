const Request = require("../../models/Request");

// Fetch all requests
async function getAllRequests(req, res) {
    try {
        const requests = await Request.find()
            .populate('user_id', 'username email')
            .populate('beneficiary_id', 'name phoneNo email');

        const sanitizedRequests = requests.map((request) => ({
            ...request._doc,
            user_id: request.user_id || { username: 'Unknown', email: 'Unknown' },
            beneficiary_id: request.beneficiary_id || { name: 'Unknown', phoneNo: 'Unknown' },
            documents: [request.image1, request.image2, request.image3, request.certficate_image].filter(Boolean),
        }));

        res.status(200).json({ requests: sanitizedRequests });
        console.log("Successfully fetched and sanitized requests", sanitizedRequests);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


// Update request status
async function updateRequestStatus(req, res) {
    try {
        const { requestId, status } = req.body;
        // console.log("Request body", req.body);
        if (!['Pending', 'Published', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
            console.log("Invalid status value");
        }
        const updatedRequest = await Request.findByIdAndUpdate(requestId, { status }, { new: true });
        res.status(200).json({ request: updatedRequest });
        console.log("Successfully updated request status", updatedRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAllRequests,
    updateRequestStatus
};
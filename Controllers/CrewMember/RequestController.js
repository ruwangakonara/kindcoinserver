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


async function updateRequestStatus(req, res) {
    try {
        const { requestId, status } = req.body;
        
        // Validate status
        const validStatuses = ['Pending', 'Published', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status value', 
                validStatuses 
            });
        }

        const updateData = {
            status: status
        };

        if (status === 'Published') {
            updateData.verified = true;
        }
        else if (status === 'Rejected' || status === 'Pending') {
            updateData.verified = false;
        }

        // Find and update the request
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            updateData,
            { status }, 
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run model validations
            }
        );

        // Check if request was found
        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Successful response
        res.status(200).json({ 
            message: 'Request status updated successfully',
            request: updatedRequest 
        });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}

module.exports = {
    getAllRequests,
    updateRequestStatus
};
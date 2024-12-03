const Recepients = require("../../models/beneficiary");

// Fetch all requests
async function getAllBeneficiaries(req, res) {
    try {
        const benificiaries= await Recepients.find()
        .populate('user_id', 'name phoneNo address email username')
        // console.log("Successfully fetched requests", benificiaries);
        
        const sanitizedRequests = benificiaries.map((request) => ({
            ...request._doc,
            user_id: request.user_id || { name: 'Unknown', email: 'Unknown' , address: 'Unknown', phoneNo: 'Unknown' },
            documents: [
                request.image1 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${request.image1}`
                    : "https://via.placeholder.com/300",
                request.image2 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${request.image2}`
                    : "https://via.placeholder.com/300",
                request.image3 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${request.image3}`
                    : "https://via.placeholder.com/300"
            ].filter(Boolean)
        }));

        res.status(200).json({ benificiaries: sanitizedRequests });
        // console.log("Successfully fetched and sanitized requests", sanitizedRequests);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update request status
async function updateBeneficiaryStatus(req, res) {
    try {
        const { recipientId, status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                 error: 'Invalid status value' });
        }

        if (!recipientId) {
            return res.status(400).json({ error: 'recipientId is required' });
        }

        const updateData = {
            status: status
        };

        if (status === 'Approved') {
            updateData.verified = true;
        }
        else if (status === 'Rejected' || status === 'Pending') {
            updateData.verified = false;
        }

        console.log('Received request with user_id:', recipientId, 'and status:', status);
        const updatedBeneficiary = await Recepients.findByIdAndUpdate(recipientId, updateData, { status }, { new: true });
        console.log("Successfully updated request status", updatedBeneficiary);
        
        if (!updatedBeneficiary) {
            console.log('Beneficiary not found for user_id:', recipientId);
            return res.status(404).json({ error: 'Beneficiary not found' });
        }
        res.status(200).json({ request:  updatedBeneficiary });
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log("Error updating request status", err.message);
    }
}

module.exports = {
    getAllBeneficiaries,
    updateBeneficiaryStatus
};
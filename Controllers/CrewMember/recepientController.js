const Recepients = require("../../models/beneficiary");

// Fetch all requests
async function getAllBeneficiaries(req, res) {
    try {
        const benificiaries= await Recepients.find()
        .populate('user_id', 'name nic')
        .populate('beneficiary_id', 'phoneNo address');
        
        const sanitizedRequests = requests.map((request) => ({
            ...request._doc,
            user_id: request.user_id || { name: 'Unknown', email: 'Unknown' },
            beneficiary_id: request.beneficiary_id || { address: 'Unknown', phoneNo: 'Unknown' },
        }));

        res.status(200).json({ requests: sanitizedRequests });
        console.log("Successfully fetched and sanitized requests", sanitizedRequests);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update request status
async function updateBeneficiaryStatus(req, res) {
    try {
        const { nic, status } = req.body;
        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
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
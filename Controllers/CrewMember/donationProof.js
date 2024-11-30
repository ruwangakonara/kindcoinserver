const Donation = require("../../models/donation");
// Fetch all requests
async function getAllDonations(req, res) {
    try {
        console.log("Called getAll Donations");

    
        const donations = await Donation.find()
            .populate('user_id', 'username email phone')     
            .populate('donor_id', 'name username phoneNo email')
            .populate('beneficiary_id', 'name') 
            .populate('request_id', 'requestId description'); 

        console.log("Fetched donations", donations);


        const formattedDonations = donations.map((donation) => ({
            donorName: donation.donor_id ? donation.donor_id.username : 'Unknown',  // Check if donor exists
            donationId: donation._id,
            requestId: donation.request_id ? donation.request_id.requestId : 'N/A', // Check if request exists
            beneficiaryId: donation.beneficiary_id ? donation.beneficiary_id.name : 'Unknown', // Check if beneficiary exists
            email: donation.user_id ? donation.user_id.email : 'Unknown', // Check if user exists
            phone: donation.user_id ? donation.user_id.phone : 'Unknown', // Check if user exists
            description: donation.description || 'No description provided', // Default description if not present
            documents: [
                donation.image1 ? `${req.protocol}://${req.get('host')}/public/${donation.image1}` : null,
                donation.image2 ? `${req.protocol}://${req.get('host')}/public/${donation.image2}` : null,
                donation.image3 ? `${req.protocol}://${req.get('host')}/public/${donation.image3}` : null,
                donation.image4 ? `${req.protocol}://${req.get('host')}/public/${donation.image4}` : null
            ].filter(Boolean), // Remove null entries
            status: donation.verified ? 'Verified' : 'Not Verified',
            attestationFee: donation.attestation_fee || 'Not Set' // Optional field for attestation fee
        }));

        // Return the formatted donations in the response
        res.status(200).json({ donations: formattedDonations });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}




// Update request status
async function updateDonationStatus(req, res) {
    try {
        const { docId, status } = req.body;
        if (!['Verified', 'Unverified'].includes(status)) {
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
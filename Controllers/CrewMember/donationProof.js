const Donation = require("../../models/donation");
// Fetch all requests
async function getAllDonations(req, res) {
    try {
        console.log("Called getAll Donations");

    
        const donations = await Donation.find()    
            .populate('donor_id', 'name username phoneNo')
            .populate('beneficiary_id', 'name phoneNo email') 
            .populate('request_id', 'requestId description'); 

        // console.log("Fetched donations", donations);


        const formattedDonations = donations.map((donation) => ({
            donorId: donation.donor_id ? donation.donor_id._id : 'Unknown', // Check if donor exists
            donorName: donation.donor_id ? donation.donor_id.name : 'Unknown',  // Check if donor exists
            donorUserName: donation.donor_id ? donation.donor_id.username : 'Unknown', // Check if donor exists
            donationId: donation._id,
            requestId: donation.request_id ? donation.request_id._id : 'N/A', // Check if request exists
            beneficiaryId: donation.beneficiary_id ? donation.beneficiary_id._id : 'Unknown',
            benificiaryName: donation.beneficiary_id ? donation.beneficiary_id.name : 'N/A',
            benificiaryPhone: donation.beneficiary_id ? donation.beneficiary_id.phoneNo : 'N/A',
            benificiaryemail: donation.user_id ? donation.beneficiary_id.email : 'N/A', 
            donorPhone: donation.user_id ? donation.donor_id.phoneNo : 'Unknown',
            verified: donation.verified,
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
        console.log("Formatted donations", formattedDonations);

        // Return the formatted donations in the response
        res.status(200).json({ donations: formattedDonations });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}




// Update donation verification status
async function updateDonationStatus(req, res) {
    try {
        const { docId } = req.body;
        const donation = await Donation.findById(docId);
        console.log("Called updateDonationStatus ", donation);
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        const updatedDonation = await Donation.findByIdAndUpdate(
            docId, 
            { verified: !donation.verified }, 
            { new: true }
        );
        console.log("Successfully updated donation status", updatedDonation);
        res.status(200).json({ 
            request: updatedDonation,
            message: updatedDonation.verified ? 'Donation Verified' : 'Donation Unverified'
        });
        
    } catch (err) {
        console.error('Error updating donation status:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllDonations,
    updateDonationStatus
};
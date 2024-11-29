const Donation = require("../../models/donation");

// Fetch all requests
async function getAllDonations(req, res) {
    try {
        console.log("Called getAll Donations");
        const donations = await Donation.find()
            .populate('user_id', 'username email phone')
            .populate('donor_id', 'username')
            .populate('beneficiary_id', 'username');

        console.log("Fetched donations", donations);

        const formattedDonations = donations.map(donation => ({
            donorName: donation.donor_id.username,
            donationId: donation._id,
            requestId: donation.request_id,
            beneficiaryId: donation.beneficiary_id.username,
            email: donation.user_id.email,
            phone: donation.user_id.phone,
            description: donation.description,
            documents: [
                `${req.protocol}://${req.get('host')}/public/${donation.image1}`,
                `${req.protocol}://${req.get('host')}/public/${donation.image2}`,
                `${req.protocol}://${req.get('host')}/public/${donation.image3}`,
                `${req.protocol}://${req.get('host')}/public/${donation.image4}`
            ],
            status: donation.verified ? 'Verified' : 'Not Verified'
        }));

        res.status(200).json({ donations: formattedDonations });
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
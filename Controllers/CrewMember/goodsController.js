const Member = require("../Home/UserController").Member
const mongoose = require("mongoose");


async function getMemberDonations(req, res) {
    try {
        // Get member from authenticated user
        const user_id = new mongoose.Types.ObjectId(req.sub);
        console.log("User id: ", user_id);
        
        // Find member
        const member = await Member.findOne({ user_id });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Find donations directly with populate
        const donations = await Donation.find({
            member_id: member._id,
            type: 'goods'
        })
        .populate('donor_id', 'name username phoneNo')
        .populate('beneficiary_id', 'name phoneNo email')
        .populate('request_id', 'title description')
        .lean();

        // Format response
        const formattedDonations = donations.map(donation => ({
            donationDetails: {
                _id: donation._id,
                title: donation.title,
                description: donation.description,
                type: donation.type,
                value: donation.value,
                verified: donation.verified,
                created: donation.created
            },
            donorDetails: donation.donor_id,
            beneficiaryDetails: donation.beneficiary_id,
            requestDetails: donation.request_id,
            documents: [
                donation.image1 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${donation.image1}`
                    : "https://via.placeholder.com/300",
                donation.image2 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${donation.image2}`
                    : "https://via.placeholder.com/300",
                donation.image3 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${donation.image3}`
                    : "https://via.placeholder.com/300",
                donation.image4 !== "https://via.placeholder.com/300"
                    ? `http://localhost:9013/images/donations/${donation.image4}`
                    : "https://via.placeholder.com/300"
            ].filter(Boolean),
        }));

        res.status(200).json({ donations: formattedDonations });

    } catch (error) {
        console.error('Error fetching member donations:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateDonationStatus(req, res) {
    try {
        const { donationId, status } = req.body;
        const user_id = new mongoose.Types.ObjectId(req.sub);
        
        // Verify member
        const member = await Member.findOne({ user_id });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Find donation and verify ownership
        const donation = await Donation.findById(donationId);
        if (!donation || donation.member_id.toString() !== member._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updateData = {
            verified: status === 'Verified'
        };

        const updatedDonation = await Donation.findByIdAndUpdate(
            donationId,
            updateData,
            { new: true }
        );

        res.status(200).json({ 
            message: 'Donation status updated successfully',
            donation: updatedDonation 
        });
    } catch (error) {
        console.error('Error updating donation status:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getMemberDonations,
    updateDonationStatus
};

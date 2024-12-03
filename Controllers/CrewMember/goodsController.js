// const Member = require("../Home/UserController").Member
const Member = require("../../models/member");
const Donation = require("../../models/donation");
// const Request = require("../../models/request");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');



async function getMemberDonations(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decodedToken = jwt.verify(token, process.env["SECRET"]);
        const user_id = decodedToken.sub.toString();
        console.log("req: ", decodedToken.sub.toString());

        const objectId = new mongoose.Types.ObjectId(user_id);
        console.log("objectId: ", objectId);
        const member = await Member.findOne({user_id:user_id});

        console.log("Member: ", member);

        if (!member) {
            const allMembers = await Member.find({});
            // console.log("All Members:", allMembers);
            // console.log("All Member user_ids:", allMembers.map(m => m.user_id));

            return res.status(404).json({ 
                message: 'Member not found', 
                details: {
                    searchedUserId: user_id,
                    convertedObjectId: objectId.toString()
                }
            });
        }

        // Find member using the user_id (assuming it's the member's _id)
        // In goodsController.js
        // const member = await Member.findOne({ user_id});
        console.log("Member: ", member);
        console.log("Member: ", member._id);
        console.log("EMail: ", member.username);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Find donations directly with populate
        console.log("Member id: ", member._id);
        const donations = await Donation.find({
            member_id: member._id,
            type: 'goods',
        })
            .populate('donor_id', 'name username phoneNo')
            .populate('beneficiary_id', 'name phoneNo email')
            .populate('request_id', 'title description');

        console.log("Donations: ", donations);

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
        const { request_id, status, goods } = req.body;

        console.log('Incoming request_id raw:', request_id);
        console.log('Incoming status:', status);
        console.log('Incoming goods:', goods);

        const donationId = new mongoose.Types.ObjectId(request_id);
        console.log('Converted ObjectId:', donationId);

        // Validate status
        const validStatuses = ['Pending', 'Published', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status value',
                validStatuses
            });
        }

        // Find existing document
        const existingDocument = await Donation.findById(donationId);
        console.log('Existing Document:', existingDocument);

        if (!existingDocument) {
            return res.status(404).json({ 
                error: 'Request not found', 
                details: `No document found with ID: ${request_id}` 
            });
        }

        // Update goods values
        existingDocument.goods.forEach(good => {
            const updatedGood = goods.find(g => g._id === good._id.toString());
            if (updatedGood) {
                good.value = updatedGood.value;
            }
        });

        // Update status and verification
        existingDocument.status = status;
        existingDocument.verified = status === 'Published';

        // Save updated document
        const updatedRequest = await existingDocument.save();

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
    getMemberDonations,
    updateDonationStatus
};

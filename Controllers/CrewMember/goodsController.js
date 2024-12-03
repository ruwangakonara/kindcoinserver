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
        const user_id = decodedToken.sub;
        console.log("req: ", decodedToken.sub);

        // Find member using the user_id (assuming it's the member's _id)
        // In goodsController.js
        const member = await Member.findOne({ user_id: new mongoose.Types.ObjectId(user_id) });
        console.log("Member: ", member._id);
        console.log("EMail: ", member.username);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Find donations directly with populate
        console.log("Member id: ", member._id);
        const donations = await Donation.find({
            member_id: member._id,
            type: 'goods'
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
        const { request_id, status } = req.body;

        console.log('Incoming request_id raw:', request_id);
        console.log('Incoming status:', status);

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

        // Determine verification status based on the new status
        const updateData = {
            status: status,
            verified: status === 'Published' ? true : false
        };

        // requestId = new mongoose.Types.ObjectId(request_id);

        const existingDocument = await Donation.findById(donationId);
        console.log('Existing Document:', existingDocument);

        if (!existingDocument) {

            return res.status(404).json({ 
                error: 'Request not found', 
                details: `No document found with ID: ${request_id}` 
            });
        }

        // Find and update the request
        const updatedRequest = await Donation.findByIdAndUpdate(
            donationId,
            updateData,
            {
                new: true,
                runValidators: true
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
    getMemberDonations,
    updateDonationStatus
};

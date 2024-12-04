// const Member = require("../Home/UserController").Member
const Member = require("../../models/member");
const Donation = require("../../models/donation");
// const Request = require("../../models/request");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
// const Beneficiary = require("../../models/beneficiary");
// const DonorNotification = require("../../models/donorNotification");
// const BeneficiaryNotification = require("../../models/beneficiaryNotification");
// const Donor = require("../../models/donor");
// const Request = require("../../models/request");




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
                status: donation.status,
                value: donation.value,
                verified: donation.verified,
                created: donation.created,
                goods: donation.goods
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


async function updateGoodsValues(req, res) {
    try {
        const { donationId, goods } = req.body;

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Explicitly update goods amounts
        donation.goods = donation.goods.map(existingGood => {
            const updatedGood = goods.find(g => g._id === existingGood._id.toString());
            
            if (updatedGood) {
                // Explicitly set the amount, converting to the same type
                existingGood.amount = String(updatedGood.amount);
            }
            
            return existingGood;
        });

        donation.status = 'Published';
        donation.verified = true;

        const updatedDonation = await donation.save();

        res.status(200).json({
            message: 'Goods values updated and status changed to Published',
            donation: updatedDonation
        });
    } catch (error) {
        console.error('Error updating goods values:', error);
        res.status(500).json({ error: error.message });
    }
}

// async function verifyGoodsDonation(req, res) {

//     try{


//         // const user_id = new mongoose.Types.ObjectId(req.sub)
//         // console.log(user_id)

//         // const member = await Member.findOne({user_id})

//         const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)

//         // const value = req.body.value;

//         // if(member._id !== donation.member_id){
//         //     return res.status(400).send()
//         // }
//         const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true, value: value}, {new: true})
//         const request = await Request.findByID(donation.request_id);

//         await Request.findByIdAndUpdate(donation.request_id, {$inc: { raised: donation?.value}})
//         // await Beneficiary.findByIdAndUpdate(request.beneficiary_id, )

//         const beneficiary = await Beneficiary.findByIdAndUpdate(request.beneficiary_id,{$inc: { raised_amount: donation?.value}}, {new: true});


//         const donornotification = {
//             title:"Donation Verified",
//             donor_id: donation.donor_id,
//             beneficiary_id: beneficiary._id,
//             request_id: request._id,
//             donation_id: donation._id,
//             member_id: donation.member_id
//         }
//         await DonorNotification.create(donornotification)

//         const beneficiarynotification = {
//             title:"Donation Reception Verified",
//             donor_id: donation.donor_id,
//             beneficiary_id: beneficiary._id,
//             request_id: request._id,
//             donation_id: donation._id,
//             member_id: donation.member_id
//         }

//         await BeneficiaryNotification.create(beneficiarynotification)

//         const donor_id = Donation.donor_id
//         const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value, no_donations: 1 } }, {new: true})

//         res.status(200).json({donor, donation})

//     } catch (error){

//         res.status(400).json({error})

//     }


// }


module.exports = {
    getMemberDonations,
    updateGoodsValues
};

const donation = require("../Donor/donation_cycle_break")
const DonorNotification = donation.DonorNotification
const BeneficiaryNotification = require("../Beneficiary/request_cycle_breaker").BeneficiaryNotification
const Donation = donation.Donation
const donor = require("../Home/UserController")
const mongoose = require("mongoose");
const Beneficiary = require("../Home/UserController").Beneficiary;
const Donor = donor.Donor
const Member = donor.Member
const Request = require("../Beneficiary/request_cycle_breaker").Request
const jwt = require('jsonwebtoken');

async function verifyMonetaryDonation(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true}, {new: true})
        const request = await Request.findById(donation.request_id);

        await Request.findByIdAndUpdate(donation.request_id, {$inc: { raised: donation?.value}})

        console.log("updated")
        const beneficiary = await Beneficiary.findByIdAndUpdate(request.beneficiary_id,{$inc: { raised_amount: donation?.value}}, {new: true});



        const donornotification = {
            title:"Donation Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
        }
        await DonorNotification.create(donornotification)

        const beneficiarynotification = {
            title:"Donation Reception Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
            member_id: donation.member_id
        }

        await BeneficiaryNotification.create(beneficiarynotification)
        console.log("we got here")

        const donor_id = donation.donor_id
        const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value, no_donations: 1 } }, {new: true})

        res.status(200).json({donor, donation})

    } catch (error){

        res.status(400).json({error})

    }


}

async function verifyGoodsDonation(req, res) {

    try{

        // const token = req.cookies.Authorization;
        // const decodedToken = jwt.verify(token, process.env["SECRET"]);
        // const user_id = decodedToken.sub.toString();
        // console.log("req: ", decodedToken.sub.toString());

        


        // const user_id = new mongoose.Types.ObjectId(req.sub)
        // console.log(user_id)

        // const member = await Member.findOne({user_id})

        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);
        console.log("Donation id : ", donation_id);

        const value = req.body.value;
        console.log("Value : ", value);

        // if(member._id !== donation.member_id){
        //     return res.status(400).send()
        // }
        const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true, value: value}, {new: true})
        console.log("Donation : ", donation);
        const request = await Request.findById(donation.request_id);
        console.log("Request : ", request);

        await Request.findByIdAndUpdate(donation.request_id, {$inc: { raised: donation?.value}})
        // await Beneficiary.findByIdAndUpdate(request.beneficiary_id, )

        const beneficiary = await Beneficiary.findByIdAndUpdate(request.beneficiary_id,{$inc: { raised_amount: donation?.value}}, {new: true});


        const donornotification = {
            title:"Donation Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
            member_id: donation.member_id
        }
        await DonorNotification.create(donornotification)

        const beneficiarynotification = {
            title:"Donation Reception Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
            member_id: donation.member_id
        }

        await BeneficiaryNotification.create(beneficiarynotification)

        const donor_id = Donation.donor_id
        const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value, no_donations: 1 } }, {new: true})

        res.status(200).json({donor, donation})

    } catch (error){

        console.log("Error : ", error);
        res.status(400).json({error})

    }


}

async function verifyDonationDoc(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const donation = await Donation.findByIdAndUpdate(donation_id, {doc_verified: true}, {new: true})
        const request = await Request.findById(donation.request_id);
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);


        const notification = {
            title:"Donation Attestation Fee Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
        }
        await DonorNotification.create(notification)


        res.status(200).send()
        // const donor_id = Donation.donor_id
        // const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value } }, {new: true})


    } catch (error){

        res.status(400).json({error})

    }


}

async function getDonationsWithDonorBeneficiaryRequestDetails(filterCriteria) {
    try {
        console.log(filterCriteria);
        const results = await Donation.aggregate([
            {
                $match: filterCriteria // Apply filter criteria
            },
            {
                $lookup: {
                    from: 'donors', // Use the exact collection name here
                    localField: 'donor_id',
                    foreignField: '_id',
                    as: 'donorDetails' // The field to be populated
                }
            },
            {
                $unwind: '$donorDetails' // Unwind the correct field
            },
            {
                $lookup: {
                    from: 'beneficiaries', // Use the exact collection name here
                    localField: 'beneficiary_id',
                    foreignField: '_id',
                    as: 'beneficiaryDetails' // The field to be populated
                }
            },
            {
                $unwind: '$beneficiaryDetails' // Unwind the correct field
            },

            {
                $lookup: {
                    from: 'requests', // Use the exact collection name here
                    localField: 'request_id',
                    foreignField: '_id',
                    as: 'requestDetails' // The field to be populated
                }
            },
            {
                $unwind: '$requestDetails' // Unwind the correct field
            },
            {
                $project: {
                    donationDetails: '$$ROOT',
                    requestDetails: '$requestDetails',
                    donorDetails: '$donorDetails',
                    beneficiaryDetails: '$beneficiaryDetails',
                    // beneficiaryAddress: '$beneficiaryDetails.address'
                }
            }
        ]);


        return results;

    } catch (error) {
        console.error('Error retrieving donations with donor details:', error);
    }
}


async function getDonations2(req, res) {

    try{

        // req.body.request_id  =  new mongoose.Types.ObjectId(req.body.request_id);

        const donations = await getDonationsWithDonorBeneficiaryRequestDetails(req.body);

        res.status(200).json({donations: donations});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}


module.exports = {
    verifyMonetaryDonation,
    verifyGoodsDonation,
    verifyDonationDoc,
    getDonations2
}
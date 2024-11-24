const donation = require("../Donor/donation_cycle_break")
const DonorNotification = donation.DonorNotification
const Donation = donation.Donation
const donor = require("../Home/UserController")
const mongoose = require("mongoose");
const {Beneficiary} = require("../Home/UserController");
const Donor = donor.Donor

async function verifyMonetaryDonation(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true}, {new: true})
        const request = await Request.findByID(donation.request_id);
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);


        const notification = {
            title:"Donation Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
        }
        await DonorNotification.create(notification)

        const donor_id = Donation.donor_id
        const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value, no_donations: 1 } }, {new: true})

        res.status(200).json({donor, donation})

    } catch (error){

        res.status(400).json({error})

    }


}

async function verifyGoodsDonation(req, res) {

    try{

        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const value = req.body.value;
        const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true, value: value}, {new: true})
        const request = await Request.findByID(donation.request_id);
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);


        const notification = {
            title:"Donation Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
            member_id: donation.member_id
        }
        await DonorNotification.create(notification)
        const donor_id = Donation.donor_id
        const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value, no_donations: 1 } }, {new: true})

        res.status(200).json({donor, donation})

    } catch (error){

        res.status(400).json({error})

    }


}

async function verifyDonationDoc(req, res) {

    try{

        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const donation = await Donation.findByIdAndUpdate(donation_id, {doc_verified: true}, {new: true})
        const request = await Request.findByID(donation.request_id);
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);


        const notification = {
            title:"Donation Attestation Fee Verified",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id,
        }
        await DonorNotification.create(notification)
        // const donor_id = Donation.donor_id
        // const donor = await Donor.findByIdAndUpdate(donor_id, { $inc: { donated: donation?.value } }, {new: true})


    } catch (error){

        res.status(400).json({error})

    }


}

module.exports = {
    verifyMonetaryDonation,
    verifyGoodsDonation,
    verifyDonationDoc
}
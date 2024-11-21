const donation = require("../Donor/donation_cycle_break")
const Donation = donation.Donation
const donor = require("../Home/UserController")
const mongoose = require("mongoose");
const Donor = donor.Donor

async function verifyMonetaryDonation(req, res) {

    try{

        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const donation = await Donation.findByIdAndUpdate(donation_id, {verified: true}, {new: true})

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
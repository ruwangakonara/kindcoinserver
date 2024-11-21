const donation = require("../../Controllers/Donor/donation_cycle_break");
const Donation = donation.Donation
const request = require("./RequestController")
const Request = request.Request
const mongoose = require("mongoose");
const dnation = require("../Home/UserController");
const Member = donation.Member;
const Donor = dnation.Donor;

async function getDonationsWithDonorDetails(filterCriteria) {
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
                $project: {
                    donationDetails: '$$ROOT',
                    donor_id: '$donorDetails._id',
                    name: '$donorDetails.name',
                    profile_image: '$donorDetails.profile_image',
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

        req.body.request_id  =  new mongoose.Types.ObjectId(req.body.request_id);

        const donations = await getDonationsWithDonorDetails(req.body);
        console.log(donations);

        console.log("asshole");
        res.status(200).json({donations: donations});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function getDonations(req, res) {
    try{

        const request = await Request.findById(req.body.request_id);

        if(request.user_id !== req.body.user_id){
            return res.status(401)
        }

        const donations = await Donation.find({request_id: req.body.request_id});
        res.status(200).json({donations: donations});

    } catch(err){

        res.status(400).json({error: err.message});

    }
}

async function getDonationyo(req, res) {
    try{
        console.log("bruh")

        const criteria = {_id: new mongoose.Types.ObjectId(req.body._id)};
        const donation = await getDonationsWithDonorDetails(criteria);
        res.status(200).json({request: donation[0]});

        // res.sendStatus(200);

    } catch(err){

        res.status(401).json({error: err.message});

    }
}

async function getDonation(req, res) {
    try{

        const donation = await Donation.findOne(req.body);


        const request = await  Request.findById(donation.request_id);

        const donor = await  Donor.findById(donation.donor_id);

        if(donation.type === "goods" && donation.member_id){
            const member = await Member.findById(donation.member_id);

            console.log("arse")
            res.status(200).json({donation: donation, request: request, donor: donor, member: member});
            return
        }


        console.log("hello")
        res.status(200).json({donation: donation, request: request, donor: donor});
    } catch(err){

        res.status(400).json({error: err.message});

    }
}

async function acceptDonation(req, res){

    try{
        await Donation.findByIdAndUpdate(new mongoose.Types.ObjectId(req.body.donation_id), {accepted:true})

        console.log("bae")

        res.status(200).json({success: true});

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getDonationyo,
    getDonations2,
    acceptDonation,
    getDonation
}
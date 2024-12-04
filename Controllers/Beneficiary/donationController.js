const donation = require("../../Controllers/Donor/donation_cycle_break");
const Donation = donation.Donation
// const request = require("./RequestController")
// const Request = request.Request
const Request = require("./request_cycle_breaker").Request
const mongoose = require("mongoose");
const users = require("../Home/UserController");
const {Beneficiary} = require("../Home/UserController");
const {request} = require('axios');
const Member = users.Member;
const Donor = users.Donor;
const DonorNotification = require("../Donor/donation_cycle_break").DonorNotification;

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
            console.log("ratton")
            const member = await Member.findById(donation.member_id);

            console.log("gorm")
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

        const donation = await Donation.findByIdAndUpdate(new mongoose.Types.ObjectId(req.body.donation_id), {accepted:true}, {new: true})
        console.log("found donation")
        const request = await Request.findById(donation.request_id)
        console.log("found request")
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);

        const notification = {
            title:"Donation Accepted",
            donor_id: donation.donor_id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: donation._id
        }

        await DonorNotification.create(notification)

        console.log("bae")

        res.status(200).json({success: true});

    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message});
    }
}



async function updateDescription(req, res){

    try{
        console.log("got here")
        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);


        const updatedDona = await Donation.findByIdAndUpdate(donation_id, {usage_description: req.body.description, edited: Date.now()}, {new: true})

        if(!updatedDona.donor_satisfied){
            const notification = {
                title:"Donation Usage Details Changed",
                donor_id: updatedDona.donor_id,
                beneficiary_id: updatedDona.beneficiary_id,
                request_id: updatedDona.request_id,
                donation_id: updatedDona._id
            }

            await DonorNotification.create(notification)
        }

        console.log("diddy")

        res.status(200).json({donation: updatedDona});
    }catch (error){
        console.log(error)
        res.status(400).json({error: err.message});

    }

}


async function updateImages(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);

        const donation = await Donation.findOne({_id: donation_id})

        console.log(req.body)
        console.log(req.sub)
        //
        // if(donation.user_id != req.sub){
        //
        //     return res.status(400).send()
        // }

        const {
            usage_image1,
            usage_image2,
            usage_image3,
            usage_image4,
            usage_image5

        } = req.files;
        // const id = req.body.donation_id
        const updated = {
            usage_image1: usage_image1 ? usage_image1[0].filename : request.usage_image1,
            usage_image2: usage_image2 ? usage_image2[0].filename : request.usage_image2,
            usage_image3: usage_image3 ? usage_image3[0].filename : request.usage_image3,
            usage_image4: usage_image4 ? usage_image4[0].filename : request.usage_image4,
            usage_image5: usage_image5 ? usage_image5[0].filename : request.usage_image5,

        }


        const updatedDona = await Donation.findByIdAndUpdate(donation_id, updated, {new: true})
        if(!updatedDona.donor_satisfied){
            const notification = {
                title:"Donation Usage Details Changed",
                donor_id: updatedDona.donor_id,
                beneficiary_id: updatedDona.beneficiary_id,
                request_id: updatedDona.request_id,
                donation_id: updatedDona._id
            }

            await DonorNotification.create(notification)
        }
        console.log("yello")

        res.status(201).json({donation: updatedDona});

    } catch(err){
        res.status(400).json({error: err.message});
    }


}



module.exports = {
    getDonationyo,
    getDonations2,
    acceptDonation,
    getDonation,
    updateImages,
    updateDescription
}
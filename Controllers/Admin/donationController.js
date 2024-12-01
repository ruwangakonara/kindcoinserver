const Donation = require("../Donor/donation_cycle_break").Donation
const Member = require("../Home/UserController").Member
const mongoose = require("mongoose");


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
        console.log(donations);

        res.status(200).json({donations: donations});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function assignMember(req, res) {


    try{
        console.log("here boss")
        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id)
        const member_id = new mongoose.Types.ObjectId(req.body.member_id)

        await Donation.findByIdAndUpdate(donation_id, {member_id: member_id})

        res.status(200).send()
    }catch (error){
        console.log(error)
        res.status(500).json({error:error.message})
    }

}


module.exports = {

    assignMember,
    getDonations2

}
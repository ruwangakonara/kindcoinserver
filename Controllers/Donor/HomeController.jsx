const donation = require("./donation_cycle_break");
const Donation = donation.Donation
const mongoose = require("mongoose")
const request = require ("../Beneficiary/request_cycle_breaker")
const Request = request.Request
const beneficiary = require("../../Controllers/Home/UserController")
const user = require("../Home/UserController");
const Donor = user.Donor

async function DonorCards(req, res) {

    user_id = new mongoose.Types.ObjectId(req.sub);

    const listings = await Donation.find({user_id, accepted: false})

    const c_lst = listings?.length

    const completed = await Donation.find({user_id, rewarded: true})

    const c_com = completed?.length

    const verified = await Donation.find({user_id, verified: true})
    const amount = verified.reduce((sum, donation) => sum + donation.value, 0);

    var tokens = completed.reduce((sum, donation) => sum + donation.token_amount, 0);

    if (!tokens) tokens = 0

    res.status(200).json({c_lst, c_com, amount, tokens})

}
//
// async function homeRequests(req, res) {
//
//     const requests = await Request.find({ open: true })
//         .sort({ created: -1 }) // Sort by 'created' date in descending order
//         .limit(4); // Limit to the most recent 4 requests
//
//     res.status(200).json({requests: requests});
//
// }

async function getRequestsWithBeneficiaryDetails(filterCriteria) {
    try {
        // console.log(filterCriteria);
        const results = await Request.aggregate([
            {
                $match: filterCriteria // Apply filter criteria
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
                $project: {
                    title: 1,
                    description:1,
                    created:1,
                    open: 1,
                    verified: 1,
                    _id: 1,
                    beneficiary_id: '$beneficiaryDetails._id',
                    name: '$beneficiaryDetails.name',
                    profile_image: '$beneficiaryDetails.profile_image',
                    // beneficiaryAddress: '$beneficiaryDetails.address'
                }
            }
        ]);


        return results;

    } catch (error) {
        console.error('Error retrieving requests with beneficiary details:', error);
    }
}



async function homeRequests(req, res) {

    try{
        const requests = await getRequestsWithBeneficiaryDetails({open:true})
        const integers = requests.map(request => {
            return {
                ...request,
                dateAsInteger: request.created.getTime() // Converts the Date object to an integer (in milliseconds)
            };
        });
        console.log(integers);

// Sort the array based on 'dateAsInteger' in descending order
        const sortedRequests = integers.sort((a, b) => b.dateAsInteger - a.dateAsInteger);

// Limit the results to the top 4 most recent requests
        const limitedRequests = sortedRequests.slice(0, 4);

// Return the sorted and limited results
        res.status(200).json({ requests: limitedRequests });

    } catch(err){

        console.log("oi")
        res.status(400).json({error: err.message});

    }

}

async function getDonors(req, res) {

    try{
        const donors = await Donor.find();

// Sort the array in descending order by the 'donated' field
        const sorted_d = donors.sort((a, b) => b.donated - a.donated).slice(0, 4);
        console.log("sorted_d");

        res.status(200).json({ donors: sorted_d });

    } catch(err){
        console.log("hoy")
        res.status(500).json({error: err.message});
    }


}



module.exports = {
    DonorCards,
    homeRequests,
    getDonors
}


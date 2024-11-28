const mongoose = require("mongoose")
const request = require ("../Beneficiary/request_cycle_breaker")
const donation = require("../Donor/donation_cycle_break");
const Donation = donation.Donation;
const Request = request.Request
const user = require("../Home/UserController");
const Donor = user.Donor
async function BeneficiaryCards(req, res) {

    const user_id = new mongoose.Types.ObjectId(req.sub);

    const openreq = await Request.find({user_id, open: true})

    const c_open = openreq?.length

    const closedreq = await Request.find({user_id, open: false})

    const c_closed = closedreq?.length

    // const verified = await Donation.find({user_id, verified: true})
    const amount = closedreq.reduce((sum, closedreqs) => sum + closedreqs.raised, 0);
    const amount2 = openreq.reduce((sum, openreqs) => sum + openreqs.raised, 0);

    // var tokens = completed.reduce((sum, donation) => sum + donation.token_amount, 0);
    //
    // if (!tokens) tokens = 0

    res.status(200).json({c_open, c_closed, amount: amount + amount2})

}

async function getDonationsWithRequestDetails(filterCriteria) {
    try {
        const results = await Donation.aggregate([
            {
                $match: filterCriteria // Apply filter criteria
            },
            {
                $lookup: {
                    from: 'requests', // Collection name for requests
                    localField: 'request_id',
                    foreignField: '_id',
                    as: 'requestDetails' // Field to be populated
                }
            },
            {
                $unwind: '$requestDetails' // Unwind the request details
            },
            {
                $lookup: {
                    from: 'donors', // Collection name for beneficiaries
                    localField: 'donor_id', // Change to the actual field name for beneficiary ID
                    foreignField: '_id',
                    as: 'donorDetails' // Field to be populated
                }
            },
            {
                $unwind: '$donorDetails' // Unwind the beneficiary details
            },
            {
                $project: {
                    title: 1,
                    description:1,
                    created: 1,
                    accepted: 1,
                    verified: 1,
                    request_id: '$requestDetails._id',
                    donor_id: '$donorDetails._id',
                    request_title: '$requestDetails.title',
                    request_phone: '$requestDetails.phone',
                    request_description: '$requestDetails.description',
                    open: '$requestDetails.open',
                    profile_image: '$donorDetails.profile_image',
                    donor_name: '$donorDetails.name', // Add other fields as needed
                }
            }
        ]);


        return results;

    } catch (error) {
        console.error('Error retrieving donations with request and beneficiary details:', error);
    }
}




async function getDonations(req, res) {

    try{


        if (req.body.beneficiary_id){
            req.body.beneficiary_id = new mongoose.Types.ObjectId(req.body.beneficiary_id);
        }



        const donations = await getDonationsWithRequestDetails(req.body)


        const integers = donations.map(donation => {
            return {
                ...donation,
                dateAsInteger: donation.created.getTime() // Converts the Date object to an integer (in milliseconds)
            };
        });


        const sortedDonations = integers.sort((a, b) => b.dateAsInteger - a.dateAsInteger);

// Limit the results to the top 4 most recent requests
        const limitedDonations = sortedDonations.slice(0, 4);



        res.status(200).json({donations: limitedDonations});

    } catch(err){

        console.log("oi")
        res.status(407).json({error: err.message});

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
    BeneficiaryCards,
    getDonations,
    getDonors
}
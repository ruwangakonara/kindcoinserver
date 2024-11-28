const request = require("../../Controllers/Beneficiary/RequestController")
const  Request = request.Request
const beneficiary = require("../../Controllers/Home/UserController")
const mongoose = require("mongoose");
const Beneficiary = beneficiary.Beneficiary

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
                    requestDetails: '$$ROOT',
                    beneficiary_id: '$beneficiaryDetails._id',
                    name: '$beneficiaryDetails.name',
                    profile_image: '$beneficiaryDetails.profile_image',
                    description: '$beneficiaryDetails.description',
                    type: '$beneficiaryDetails.type',
                    // beneficiaryAddress: '$beneficiaryDetails.address'
                }
            }
        ]);

        console.log(results);

        return results;

    } catch (error) {
        console.error('Error retrieving requests with beneficiary details:', error);
    }
}



async function getRequests(req, res) {

    try{
        const requests = await getRequestsWithBeneficiaryDetails(req.body);
        // console.log(requests);

        res.status(200).json({requests: requests});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}


async function getRequestyo(req, res) {
    try{
console.log("bruh")

        const criteria = {_id: new mongoose.Types.ObjectId(req.body._id)};
        const request = await getRequestsWithBeneficiaryDetails(criteria);
        res.status(200).json({request: request[0]});

        // res.sendStatus(200);

    } catch(err){

        res.status(401).json({error: err.message});

    }
}

module.exports = {
    getRequestyo,
    getRequests
}
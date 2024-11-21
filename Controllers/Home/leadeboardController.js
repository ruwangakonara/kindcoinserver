const donor = require("./UserController")
const mongoose = require("mongoose");
const error = require("multer/lib/multer-error");
const Donor = donor.Donor
const Comment = require("../../models/Comment");



async function getCommentswithBeneficairy(filterCriteria) {
    try {
        console.log(filterCriteria);
        const results = await Comment.aggregate([
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
                    body: 1,
                    _id:1,
                    donor_id:1,
                    beneficiary_id:1,
                    // donor_id: '$donorDetails._id',
                    name: '$beneficiaryDetails.name',
                    profile_image: '$beneficiaryDetails.profile_image',
                    // beneficiaryAddress: '$beneficiaryDetails.address'
                }
            }
        ]);


        return results;

    } catch (error) {
        console.error('Error retrieving donations with donor details:', error);
    }
}



async function getComments(req, res) {

    try{

        req.body.donor_id  =  new mongoose.Types.ObjectId(req.body.donor_id);

        const comments = await getCommentswithBeneficairy(req.body);
        console.log(comments);

        res.status(200).json({comments});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function getDonors(req, res){

    try{
        const donors = await Donor.find()
        res.status(200).json({donors: donors});
    } catch(err){

        res.status(500).send({error: error.message});

    }

}

async function getDonor(req, res){

    try {

        const donor_id = new mongoose.Types.ObjectId(req.body.donor_id);

        const donor = await Donor.findById(donor_id)

        // const comments = await Comment.find({donor_id})

        res.status(200).json({ donor, tokens: donor?.tokens});

    } catch (error){
        res.status(500).send()
    }

}

// async function putComment(req, res){
//     try{
//
//         const donor_id = req.body.donor_id;
//
//         await Comment.create({donor_id, name: req.body.name, body: req.body.body})
//         console.log("rambo")
//
//         const comments = await Comment.findById(donor_id)
//
//         res.status(200).json({comments: comments});
//
//     } catch(err){
//         console.log(err)
//         res.sendStatus(500)
//     }
// }


module.exports = {
    getDonors,
    getDonor,
    getComments,
    Comment
}


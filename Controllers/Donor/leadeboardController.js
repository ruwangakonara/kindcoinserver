const donor = require("../Home/UserController")
const mongoose = require("mongoose");
const error = require("multer/lib/multer-error");
const request = require("../Beneficiary/request_cycle_breaker");
const Donor = donor.Donor
const Comment = require("../Home/leadeboardController").Comment
// const Donation = require("./donation_cycle_break").Donation



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

async function updateImages(req, res) {

    try{


        const _id = new mongoose.Types.ObjectId(req.body.id);

        const donor = await Donor.findOne({_id})

        console.log(req.body)
        console.log(req.sub)

        if(donor.user_id != req.sub){

            return res.status(400).send()
        }

        const {
            image1,
            image2,
            image3,
            image4,
            image5
        } = req.files;
        // const id = req.body.donation_id
        const updated = {
            image1: image1 ? image1[0].filename : request.image1,
            image2: image2 ? image2[0].filename : request.image2,
            image3: image3 ? image3[0].filename : request.image3,
            image4: image4 ? image4[0].filename : request.image4,
            image5: image5 ? image5[0].filename : request.image5,

        }


        const updatedDono = await Donor.findByIdAndUpdate(_id, updated, {new: true})
        console.log("yello")

        res.status(201).json({donor: updatedDono});

    } catch(err){
        res.status(400).json({error: err.message});
    }


}

module.exports = {
    getDonors,
    getDonor,
    getComments,
    updateImages
}


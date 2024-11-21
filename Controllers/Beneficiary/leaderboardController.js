const donor = require("../Home/UserController")
const mongoose = require("mongoose");
const error = require("multer/lib/multer-error");
const Donor = donor.Donor
const Comment = require("../Home/leadeboardController").Comment



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

        console.log(req.body)
        req.body.donor_id  =  new mongoose.Types.ObjectId(req.body.donor_id);

        const comments = await getCommentswithBeneficairy(req.body);

        res.status(200).json({comments});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function getDonors(req, res){

    try{
        const donors = await Donor.find()
        console.log("hey")

        res.status(200).json({donors: donors});
    } catch(err){

        res.status(500).send({error: error.message});

    }

}

async function getDonor(req, res){

    try {

        const donor_id = new mongoose.Types.ObjectId(req.body.donor_id);

        console.log("les");

        const donor = await Donor.findById(donor_id)


        res.status(200).json({ donor, tokens: donor?.tokens});

    } catch (error){
        res.status(500).send()
    }

}

async function putComment(req, res){
    try{

        const donor_id = new mongoose.Types.ObjectId(req.body.donor_id);
        const beneficiary_id = req.body.beneficiary_id
        console.log(req.body)

        await Comment.create({donor_id, beneficiary_id, body: req.body.body})

        const comments = await getCommentswithBeneficairy({donor_id});



        res.status(200).json({comments: comments});

    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

async function updateComment(req, res){
    try{

        const comment_id = new mongoose.Types.ObjectId(req.body.id);
        console.log(req.body)

       const comment =  await Comment.findByIdAndUpdate(comment_id, { body: req.body.body}, {new:true})


        const donor_id = comment?.donor_id

        const comments = await getCommentswithBeneficairy({donor_id});



        res.status(200).json({comments: comments});

    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

async function deleteComment(req, res){
    try{

        const comment_id = new mongoose.Types.ObjectId(req.body.id);
        console.log(req.body)

        const comment =  await Comment.findById(comment_id)

        await Comment.findByIdAndDelete(comment_id)

        const donor_id = comment?.donor_id

        const comments = await getCommentswithBeneficairy({donor_id});



        res.status(200).json({comments: comments});

    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports = {
    getDonors,
    getDonor,
    getComments,
    putComment,
    updateComment,
    deleteComment

}


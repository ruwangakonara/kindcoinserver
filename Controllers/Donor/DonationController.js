const donation = require("./donation_cycle_break")
const Donation = donation.Donation
const request = require("../Beneficiary/request_cycle_breaker");

const Request = request.Request
const beneficiary = require("../../Controllers/Home/UserController")
const mongoose = require("mongoose");
const Beneficiary = beneficiary.Beneficiary
const BeneficiaryNotification = require("../Beneficiary/request_cycle_breaker").BeneficiaryNotification

const Member = require("../../Controllers/Home/UserController").Member;


// async function createDonation(req, res) {
//
//     try{
//         if (req.body.type === "goods"){
//             const {user_id, donor_id, title, description, address, phone, email, type, goods, name, value, request_id} = req.body;
//             const donation = await Donation.create({user_id, donor_id, title, description, address, phone, email, type, goods, name, value, request_id});
//             res.status(201).json({donation: donation});
//
//         } else {
//             const {user_id, donor_id, title, description, address, phone, email, type, name, value, request_id} = req.body;
//             const donation = await Donation.create({user_id, donor_id, title, description, address, phone, email, type, name, value, request_id});
//             res.status(201).json({donation: donation});
//
//         }
//
//
//     } catch(err){
//
//         res.status(400).json({error: err.message});
//     }
//
//
// }

async function createDonation(req, res) {

    try{
        if (req.body.type === "goods"){


            const { title, description, goods, type} = req.body;
            console.log("dduh")
            const user_id = new mongoose.Types.ObjectId(req.body.user_id)
            const donor_id = new mongoose.Types.ObjectId(req.body.donor_id)
            const request_id = new mongoose.Types.ObjectId(req.body.request_id)
            const beneficiary_id = new mongoose.Types.ObjectId(req.body.beneficiary_id)
            const donation = await Donation.create({user_id, donor_id, title, description, goods, request_id, beneficiary_id, type});

            //notify

            const notification = {
                title:"New Donation Listed",
                donor_id: donor_id,
                beneficiary_id: beneficiary_id,
                request_id: request_id,
                donation_id: donation._id,
            }
            await BeneficiaryNotification.create(notification)
            //







            res.status(201).json({donation: donation});


        } else {
            console.log("Nigga")

            const { title, description, value, type} = req.body;
            const user_id = new mongoose.Types.ObjectId(req.body.user_id)
            const donor_id = new mongoose.Types.ObjectId(req.body.donor_id)
            const request_id = new mongoose.Types.ObjectId(req.body.request_id)
            const beneficiary_id = new mongoose.Types.ObjectId(req.body.beneficiary_id)
            const donation = await Donation.create({user_id, donor_id, beneficiary_id, title, description, value, request_id, type});


            //notify

            const notification = {
                title:"New Donation Listed",
                donor_id: donor_id,
                beneficiary_id: beneficiary_id,
                request_id: request_id,
                donation_id: donation._id,
            }
            await BeneficiaryNotification.create(notification)

            //


            res.status(201).json({donation: donation});

        }


    } catch(err){

        res.status(409).json({error: err.message});
    }


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
                    from: 'beneficiaries', // Collection name for beneficiaries
                    localField: 'beneficiary_id', // Change to the actual field name for beneficiary ID
                    foreignField: '_id',
                    as: 'beneficiaryDetails' // Field to be populated
                }
            },
            {
                $unwind: '$beneficiaryDetails' // Unwind the beneficiary details
            },
            {
                $project: {
                    donationDetails: '$$ROOT',
                    request_id: '$requestDetails._id',
                    beneficiary_id: 'beneficiaryDetails._id',
                    request_title: '$requestDetails.title',
                    request_phone: '$requestDetails.phone',
                    request_description: '$requestDetails.description',
                    profile_image: '$beneficiaryDetails.profile_image',
                    beneficiary_name: '$beneficiaryDetails.name', // Add other fields as needed
                }
            }
        ]);

        console.log(results);

        return results;

    } catch (error) {
        console.error('Error retrieving donations with request and beneficiary details:', error);
    }
}


// async function getDonations(req, res) {
//
//     try{
//
//         const donations = await Donation.find(req.body);
//         res.status(200).json({requests: donations});
//
//     } catch(err){
//
//         res.status(400).json({error: err.message});
//
//     }
//
// }

async function getDonations(req, res) {

    try{


        if (req.body.donor_id){
            req.body.donor_id = new mongoose.Types.ObjectId(req.body.donor_id);
        }

        console.log(req.body)


        const donations = await getDonationsWithRequestDetails(req.body);
        console.log(donations);

        res.status(200).json({donations: donations});

    } catch(err){

        res.status(407).json({error: err.message});

    }

}

async function getDonation(req, res) {
    try{

        const donation = await Donation.findOne(req.body);
        console.log(donation)

        const request = await  Request.findById(donation.request_id);
        console.log("passed")

        const beneficiary = await  Beneficiary.findById(donation.beneficiary_id);
        console.log("passed bene")

        if(donation.type === "goods" && donation.member_id){
            const member = await Member.findById(donation.member_id);

            console.log("arse")
            res.status(200).json({donation: donation, request: request, beneficiary: beneficiary, member: member});
            return
        }


        console.log("hello")
        res.status(200).json({donation: donation, request: request, beneficiary: beneficiary});
    } catch(err){

        console.log("lop")
        res.status(400).json({error: err.message});

    }
}


async function updateDonation(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);

        const donation = await Donation.findOne({_id: donation_id})

        if(donation.user_id != req.sub){

            return res.status(400).send()
        }


        // const id = req.body.donation_id
        const updated = {
            title: req.body.title,
            description: req.body.description,
            value: req.body.value,
            phone: req.body.phone

        }

        if(req.body.goods){
            updated.goods = req.body.goods
        }

        const updatedDona = await Donation.findByIdAndUpdate(donation_id, updated, {new: true})
        console.log("yello")

        res.status(201).json({donation: updatedDona});

    } catch(err){
        res.status(400).json({error: err.message});
    }


}

async function updateDocTraID(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);

        const donation = await Donation.findOne({_id: donation_id})

        if(donation.user_id != req.sub){

            return res.status(400).send()
        }

        console.log("raiden")

        // const id = req.body.donation_id
        const updated = {
            doc_transac_id: req.body.doc_transac_id,


        }


        const updatedDona = await Donation.findByIdAndUpdate(donation_id, updated, {new: true})
        console.log("yello")

        res.status(201).json({donation: updatedDona});

    } catch(err){
        res.status(400).json({error: err.message});
    }


}


async function updateImages(req, res) {

    try{


        const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);

        const donation = await Donation.findOne({_id: donation_id})

        console.log(req.body)
        console.log(req.sub)

        if(donation.user_id != req.sub){

            return res.status(400).send()
        }

        const {
            image1,
            image2,
            image3,
            image4
        } = req.files;
        // const id = req.body.donation_id
        const updated = {
            image1: image1 ? image1[0].filename : request.image1,
            image2: image2 ? image2[0].filename : request.image2,
            image3: image3 ? image3[0].filename : request.image3,
            image4: image4 ? image4[0].filename : request.image4,

        }


        const updatedDona = await Donation.findByIdAndUpdate(donation_id, updated, {new: true})
        console.log("yello")

        res.status(201).json({donation: updatedDona});

    } catch(err){
        res.status(400).json({error: err.message});
    }


}

async function deleteDonation(req, res) {

    try{
        const {user_id, id} = req.body

        const donation = await Donation.findOne({_id: id})

        if(donation){
            if (donation.user_id === user_id){
                await Donation.deleteOne({_id: id})

                res.status(200).send()
            } else {
                res.status(401).send()
            }
        } else {
            res.status(401).send()
        }


    } catch (err){
        res.status(400).json({error: err.message});
    }
}

module.exports = {
    createDonation,
    updateDonation,
    deleteDonation,
    getDonation,
    getDonations,
    updateImages,
    updateDocTraID,
    Member
}
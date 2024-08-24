const Donation = require("../../models/donation");
const request = require("../../Controllers/Beneficiary/RequestController");
const Request = request.Request

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

            const {user_id, donor_id, title, description, goods, request_id, type} = req.body;
            const donation = await Donation.create({user_id, donor_id, title, description, goods, request_id, type});
            res.status(201).json({donation: donation});

        } else {
            console.log("Nigga")

            const {user_id, donor_id, title, description, value, request_id, type} = req.body;
            const donation = await Donation.create({user_id, donor_id, title, description, value, request_id, type});
            res.status(201).json({donation: donation});

        }


    } catch(err){

        res.status(409).json({error: err.message});
    }


}

async function getDonations(req, res) {

    try{

        const donations = await Donation.find(req.body);
        res.status(200).json({requests: donations});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function getDonation(req, res) {
    try{

        const donation = await Donation.findOne(req.body);
        res.status(200).json({donation: donation});

    } catch(err){

        res.status(400).json({error: err.message});

    }
}


async function updateDonation(req, res) {

    try{


        const donation = await Donation.findOne({_id: req.body.donation_id})

        if(donation.user_id !== user_id){
            return res.status(400).send()
        }


        const id = req.body.donation_id
        delete req.body.donation_id
        const updatedDona = await Donation.findByIdAndUpdate(id, req.body)

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
    getDonations
}
const Donation = require("../../models/donation");
const Request = require("../../models/request");

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

async function getDonation(req, res) {




}

async function acceptDonation(req, res){

    try{
        await Donation.findByIdAndUpdate(req.body.request_id, {accepted: req.body.accepted})
    } catch (error) {

    }
}
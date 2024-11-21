const request = require("./request_cycle_breaker")
const Request = request.Request
const mongoose = require("mongoose");
const donation = require("../Donor/DonationController")
const  Donation = donation.Donation

async function createRequest(req, res) {

    try{
        console.log("yo")
        const {user_id, beneficiary_id, title, description, address, phone, email, type} = req.body;

        if(user_id !== req.sub){
            return res.status(400).send({})
        }

        const request = await Request.create({user_id, beneficiary_id, title, description, address, phone, email, type})

        res.status(201).json({request: request});
    } catch(err){

        res.status(400).json({error: err.message});
    }


}

async function updateRequest(req, res) {

    try{
        console.log("straight")
        const {
            image1,
            image2,
            image3,
            certificate_image
        } = req.files;
        const {user_id, request_id, title, description, address, email, phone, type} = req.body;

        const request = await Request.findOne({_id: request_id})
        const r_id = new mongoose.Types.ObjectId(request_id);

        const updatedData = {
            title,
            address,
            description,
            email,
            phone,
            type,
            // profile_image: profile_image ? profile_image[0].filename : beneficiary.profile_image,
            image1: image1 ? image1[0].filename : request.image1,
            image2: image2 ? image2[0].filename : request.image2,
            image3: image3 ? image3[0].filename : request.image3,
            certificate_image: certificate_image ? certificate_image[0].filename : request.certificate_image,
        };


        const ob_user_id = new mongoose.Types.ObjectId(user_id);

        console.log("user_id")

        if(String(request.user_id) !== user_id){
            console.log(ob_user_id)
            console.log(request.user_id)

            return res.status(400).send()
        }


        const updatedReq = await Request.findByIdAndUpdate(r_id, updatedData, { new: true })

        res.status(201).json({request: updatedReq});

    } catch(err){

        res.status(400).json({error: err.message});
    }


}

async function getRequests(req, res) {

    try{

        const requests = await Request.find(req.body);
        res.status(200).json({requests: requests});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function getMyRequests(req, res) {

    try{

        if(req.body.user_id !== req.sub){
            return res.status(400).send({})
        }
        const requests = await Request.find(req.body);
        res.status(200).json({requests: requests});

    } catch(err){

        res.status(400).json({error: err.message});

    }

}

async function closeRequest(req, res){

    try{

        const id = req.body.request_id;

        const donations = await Donation.find({verified: true, request_id: id})

        const value = donations.reduce((sum, donation) => sum + donation.value, 0)

        const updatedReq = await Request.findByIdAndUpdate(id, {open: false, raised: value}, { new: true })

        res.sendStatus(200)

    }catch(err){

        res.status(400).json({error: err.message});

    }
}

async function getRequest(req, res) {
    try{

        if(req.body._id){

            req.body._id = new mongoose.Types.ObjectId(req.body._id);

        }

        const request = await Request.findOne(req.body);
        res.status(200).json({request: request});

    } catch(err){

        res.status(400).json({error: err.message});

    }
}


async function deleteRequest(req, res) {

    try{
        const {user_id, id} = req.body

        const request = await Request.findOne({_id: id})

        if(request){
            if (request.user_id === user_id){
                await Request.deleteOne({_id: id})

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
    createRequest,
    updateRequest,
    deleteRequest,
    getRequests,
    getRequest,
    getMyRequests,
    Request,
    closeRequest
}
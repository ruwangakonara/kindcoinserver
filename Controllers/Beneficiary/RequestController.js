const Request = require("../../models/Request");

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
        const {user_id, request_id, title, description, images, certificate_image, address, email, phone} = req.body;

        const request = await Request.findOne({_id: request_id})

        if(request.user_id !== user_id){
            return res.status(400).send()
        }


        const updatedReq = await Request.updateOne({_id: request_id}, {title: title, description: description, address: address, phone: phone, email: email, certificate_image: certificate_image, images: images})

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

async function getRequest(req, res) {
    try{

        const request = await Request.findOne(req.body);
        res.status(200).json({requests: request});

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
}
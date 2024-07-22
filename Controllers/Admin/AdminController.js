const User = require('../../models/user');
const Donation = require("../../models/donation");
// const Token = require("../../models/token");
const Beneficiary = require("../../models/beneficiary");
const Request = require("../../models/request");


// router.get('/alldonations', AdminController.getAllDonations);
// router.get('/alltokens', AdminController.getAllTokens);
// router.get('/allbeneficiaries', AdminController.getAllBeneficiaries);
// router.get('/allrequests', AdminController.getAllRequests);
router.delete('/removeuser:id', AdminController.removeUser);

const getAllDonations = async(req, res) => {   
    try{
        const donations = Donation.find(req.body);
        res.status(200).json({requests: donations});
    } catch(err){
        res.status(400).json({error: err.message});
    }
}

const getAllUsers = async(req, res) => {    
    try{
        const users = User.find(req.body);
        res.status(200).json({requests: users});
    } catch(err){
        res.status(400).json({error: err.message});
    }
}

const getAllBeneficiaries = async(req, res) => {    
    try{
        const beneficiaries = Beneficiary.find(req.body);
        res.status(200).json({requests: beneficiaries});
    } catch(err){
        res.status(400).json({error: err.message});
    }
}

const getAllRequests = async(req, res) => {    
    try{
        const requests = Request.find(req.body);
        res.status(200).json({requests: requests});
    } catch(err){
        res.status(400).json({error: err.message});
    }
}

const removeUser = async(req, res) => {    
    try{
        const user = User.deleteOne(req.params.id);
        res.status(200).json({requests: user});
    } catch(err){
        res.status(400).json({error: err.message});
    }

    // try{
    //     const {user_id, id} = req.body

    //     const user = await User.findOne({_id: id})

    //     if(donation){
    //         if (donation.user_id === user_id){
    //             await Donation.deleteOne({_id: id})

    //             res.status(200).send()
    //         } else {
    //             res.status(401).send()
    //         }
    //     } else {
    //         res.status(401).send()
    //     }


    // }


}

module.exports = {
    getAllDonations, 
    getAllUsers,
    getAllBeneficiaries,
    getAllRequests
}
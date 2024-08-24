const Beneficiary = require("../../models/beneficiary");
const Donor = require("../../models/donor");

async function updateBeneficiary(req, res) {

    try{
        const user_id = req.body.user_id
        const beneficiary_id = req.body.beneficiary_id

        const beneficiary = await Beneficiary.findById(beneficiary_id)

        if(beneficiary.user_id !== user_id){
            return res.status(400).send()
        }

        delete req.body.beneficiary_id
        const updatedBen = await Beneficiary.findByIdAndUpdate(beneficiary_id, req.body)

        res.status(201).json({beneficiary: updatedBen});



    }catch(err){
        res.status(400).json({error: err.message});
    }



}

async function get_account (req, res) {

    try{

        const user_id = req.sub
        // if(user_id !== req.sub){
        //     return res.status(400).send()
        // }
        const beneficiary = await Beneficiary.findOne({user_id})
        res.status(200).json({beneficiary});
    } catch (error){
        console.log(error)
        res.status(400).send()
    }



}

module.exports = {
    updateBeneficiary,
    get_account
}
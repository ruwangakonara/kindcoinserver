const UserController = require('../Home/UserController');
const Donor = UserController.Donor
const Beneficiary = UserController.Beneficiary
const mongoose = require('mongoose');


async function getDonors(req, res) {

    try {
        const donors = await Donor.find()
        res.status(200).json({donors: donors});

    }catch(error) {
        res.status(500).send({error: error.message});

    }


}


async function getBeneficiaries(req, res) {

    try {
        const beneficiaries = await Beneficiary.find()
        res.status(200).json({beneficiaries: beneficiaries});

    }catch(error) {
        res.status(500).send({error: error.message});

    }


}

async function getDonor(req, res) {

    console.log("FUCK YOU")

        try {
            const donor = await Donor.findOne(req.body)
            console.log(donor)
            res.status(200).json({donor: donor});

        }catch(error) {
            res.status(500).send({error: error.message});

        }


}

async function getBeneficiary(req, res) {


    try {
        console.log("tyo")

        const beneficiary = await Beneficiary.findOne(req.body)
        res.status(200).json({beneficiary: beneficiary});

    }catch(error) {
        res.status(500).send({error: error.message});

    }


}



module.exports = {

    getBeneficiaries,
    getDonors,
    getDonor,
    getBeneficiary

}
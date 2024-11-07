const Beneficiary = require("../../models/beneficiary");
const Donor = require("../../models/donor");
const mongoose = require("mongoose");


async function updateBeneficiary(req, res) {
    try {
        const {
            profile_image,
            image1,
            image2,
            image3,
            certificate_image
        } = req.files;

        const {
            user_id,
            beneficiary_id,
            address,
            name,
            description,
            district,
            phoneNo
        } = req.body;

        const beneficiary = await Beneficiary.findById(beneficiary_id);
        const b_id = new mongoose.Types.ObjectId(beneficiary_id);

        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        if (beneficiary.user_id.toString() !== req.sub) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedData = {
            name,
            address,
            description,
            district,
            phoneNo,
            profile_image: profile_image ? profile_image[0].filename : beneficiary.profile_image,
            image1: image1 ? image1[0].filename : beneficiary.image1,
            image2: image2 ? image2[0].filename : beneficiary.image2,
            image3: image3 ? image3[0].filename : beneficiary.image3,
            certificate_image: certificate_image ? certificate_image[0].filename : beneficiary.certificate_image,
        };

        const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(b_id, updatedData, { new: true });

        if (!updatedBeneficiary) {
            return res.status(404).json({ error: 'Failed to update beneficiary' });
        }

        res.status(200).json({ beneficiary: updatedBeneficiary });
    } catch (error) {
        console.error('Error updating beneficiary account:', error);
        res.status(500).json({ error: 'Server error' });
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
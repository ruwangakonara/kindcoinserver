const Donor = require("../../models/donor");
const Donation = require("../../models/donation");

const path = require("path")
const fs = require("fs")




async function updateDonor(req, res) {
    try {
        const  filename  = req.file ? req.file.filename : undefined;
        console.log(filename)
        const {user_id, donor_id, address, usual_donations, name, description, anonymous, stellar_address } = req.body;

        const donor = await Donor.findById(req.body.donor_id);

        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        if (donor.user_id.toString() !== req.sub) {
            return res.status(403).json({ error: 'Unauthorized' });
        }


        const updatedData = {
            description,
            address,
            usual_donations,
            name,
            anonymous,
            stellar_address
        };

        if (filename){
            updatedData.profile_image = filename;
        }
        const updatedDonor = await Donor.findByIdAndUpdate(donor_id, updatedData, { new: true });

        console.log()

        if (!updatedDonor) {
            return res.status(404).json({ error: 'Failed to update donor' });
        }

        res.status(200).json({ donor: updatedDonor });
    } catch (error) {
        console.error('Error updating donor account:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function get_account (req, res) {

    try{

        const user_id = req.sub
        // if(user_id !== req.sub){
        //     return res.status(400).send()
        // }
        const donor = await Donor.findOne({user_id})
        res.status(200).json({donor: donor});
    } catch (error){
        console.log(error)
        res.status(400).send()
    }



}

module.exports = {
    updateDonor,
    get_account
}


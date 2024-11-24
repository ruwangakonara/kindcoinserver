const DonorNotification = require("./donation_cycle_break").DonorNotification
const Donor = require("../Home/UserController").Donor
const mongoose = require("mongoose")

async function getNotificationsWithRequestBeneficiaryDonationDetails(filterCriteria) {
    try {
        const results = await DonorNotification.aggregate([
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
                    from: 'donations', // Collection name for beneficiaries
                    localField: 'donation_id', // Change to the actual field name for beneficiary ID
                    foreignField: '_id',
                    as: 'donationDetails' // Field to be populated
                }
            },

            {
                $unwind: '$donationDetails' // Unwind the beneficiary details
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
                    // title: 1,
                    // description:1,
                    // created: 1,
                    // accepted: 1,
                    // verified: 1,
                    // request_id: '$requestDetails._id',
                    // donor_id: '$donorDetails._id',
                    // request_title: '$requestDetails.title',
                    // request_phone: '$requestDetails.phone',
                    // request_description: '$requestDetails.description',
                    // open: '$requestDetails.open',
                    // profile_image: '$donorDetails.profile_image',
                    // donor_name: '$donorDetails.name', // Add other fields as needed
                    notificationDetails:"$$ROOT",
                    beneficiaryDetails:"$beneficiaryDetails",
                    donationDetails:"$donationDetails",
                    requestDetails:"$requestDetails",
                }
            }
        ]);


        return results;

    } catch (error) {
        console.error('Error retrieving donations with request and beneficiary details:', error);
    }
}

async function getNotifications(req, res){

    try{
        const user_id = new mongoose.Types.ObjectId(req.sub)
        console.log(user_id)

        const donor = await Donor.findOne({user_id})
        donor_id = donor._id;

        console.log(donor_id);

        const notifications = await getNotificationsWithRequestBeneficiaryDonationDetails({donor_id});
        console.log(notifications)

        res.status(200).json({notifications});
    } catch(err){
        console.log(err)
        res.status(422).json({error: err})
    }


}

async function markAsViewed(req, res){

    try{
        var {donor_id, notify_id} = req.body

        notify_id = new mongoose.Types.ObjectId(notify_id)
        donor_id = new mongoose.Types.ObjectId(donor_id)


        const notification = await DonorNotification.findById(notify_id)
        if (notification.donor_id !== donor_id){
            return res.status(400).send()

        }

        await DonorNotification.findByIdAndUpdate(notify_id, {viewed: true})
        res.status(200).send()
    } catch (err){
        console.log(err)
        res.status(422).json({error: err})
    }

}

module.exports = {
    getNotifications,
    markAsViewed,
}
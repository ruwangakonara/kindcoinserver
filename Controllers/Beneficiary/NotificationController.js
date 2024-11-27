const BeneficiaryNotification = require("./request_cycle_breaker").BeneficiaryNotification
const Beneficiary = require("../Home/UserController").Beneficiary
const mongoose = require("mongoose")

async function getNotificationsWithRequestDonorDonationDetails(filterCriteria) {
    try {
        const results = await BeneficiaryNotification.aggregate([
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
                    from: 'donors', // Collection name for beneficiaries
                    localField: 'donor_id', // Change to the actual field name for beneficiary ID
                    foreignField: '_id',
                    as: 'donorDetails' // Field to be populated
                }
            },

            {
                $unwind: '$donorDetails' // Unwind the beneficiary details
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
                    donorDetails:"$donorDetails",
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

        const beneficiary = await Beneficiary.findOne({user_id})
        beneficiary_id = beneficiary._id;

        console.log(beneficiary_id);

        const notifications = await getNotificationsWithRequestDonorDonationDetails({beneficiary_id});
        // console.log(notifications)

        res.status(200).json({notifications});
    } catch(err){
        console.log(err)
        res.status(422).json({error: err})
    }


}

async function getNotificationV(req, res){

    try{
        const user_id = new mongoose.Types.ObjectId(req.sub)
        console.log("vallachia")

        const beneficiary = await Beneficiary.findOne({user_id})
        beneficiary_id = beneficiary._id;

        console.log(beneficiary_id);

        const notifications = await BeneficiaryNotification.find({beneficiary_id});
        // console.log(notifications)

        res.status(200).json({notifications});
        console.log("done")
    } catch(err){
        console.log(err)
        res.status(422).json({error: err})
    }


}

async function markAsViewed(req, res){

    try{
        console.log("reid")
        var {beneficiary_id, notify_id} = req.body

        notify_id = new mongoose.Types.ObjectId(notify_id)
        beneficiary_id = new mongoose.Types.ObjectId(beneficiary_id)

console.log(beneficiary_id)
        const notification = await BeneficiaryNotification.findById(notify_id)
        console.log(notification.beneficiary_id)

        if (!notification.beneficiary_id.equals(beneficiary_id)) {
            console.log("cookedx")

            return res.status(400).send()

        }

        await BeneficiaryNotification.findByIdAndUpdate(notify_id, {viewed: true})
        res.status(200).send()
    } catch (err){
        console.log(err)
        res.status(422).json({error: err})
    }

}

module.exports = {
    getNotifications,
    markAsViewed,
    getNotificationV
}
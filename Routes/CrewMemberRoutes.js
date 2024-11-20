const express = require('express');
const router = express.Router();

const requireCrewMemberAuth = require('../Middleware/CrewMember/requireMemberAuth');

const donationProof = require("../Controllers/CrewMember/donationProof");
const recepientController = require("../Controllers/CrewMember/recepientController");
const requestController = require("../Controllers/CrewMember/requestController");


router.get("/get_donation_proof", requireCrewMemberAuth, donationProof.getAllDonations)
router.put("/update_donation_status", requireCrewMemberAuth, donationProof.updateDonationStatus)
router.get("/get_recepient", requireCrewMemberAuth, recepientController.getAllBeneficiaries)
router.put("/update_recepient_status", requireCrewMemberAuth, recepientController.updateBeneficiaryStatus)
router.get("/get_request", requireCrewMemberAuth, requestController.getAllRequests)
router.put("/update_request_status", requireCrewMemberAuth, requestController.updateRequestStatus)

module.exports = router;




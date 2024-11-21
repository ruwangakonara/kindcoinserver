const express = require('express');
const router = express.Router();

const requireCrewMemberAuth = require('../Middleware/CrewMember/requireMemberAuth');

const donationProof = require("../Controllers/CrewMember/donationProof");
const recepientController = require("../Controllers/CrewMember/recepientController");
const requestController = require("../Controllers/CrewMember/RequestController");


router.get("/get_donation_proof", requireCrewMemberAuth, donationProof.getAllDonations)
router.put("/update_donation_status", requireCrewMemberAuth, donationProof.updateDonationStatus)
router.get("/get_recepient", requireCrewMemberAuth, recepientController.getAllBeneficiaries)
router.put("/update_recepient_status", requireCrewMemberAuth, recepientController.updateBeneficiaryStatus)
router.get("/get_request", requestController.getAllRequests)//Todo: Configure crew member auth
router.put("/update_request_status", requestController.updateRequestStatus)//Todo: Configure crew member auth
router

module.exports = router;




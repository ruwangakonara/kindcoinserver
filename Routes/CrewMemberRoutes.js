const express = require('express');
const router = express.Router();

const requireMemberAuth = require('../Middleware/CrewMember/requireMemberAuth');

const donationProof = require("../Controllers/CrewMember/donationProof");
const recepientController = require("../Controllers/CrewMember/recepientController");
const requestController = require("../Controllers/CrewMember/RequestController");


router.get("/get_donation_proof", requireMemberAuth, donationProof.getAllDonations)
router.put("/update_donation_status", requireMemberAuth, donationProof.updateDonationStatus)
router.get("/get_recepient",  recepientController.getAllBeneficiaries)//Todo: Update auth
router.put("/update_recepient_status",  recepientController.updateBeneficiaryStatus)//Todo: Update auth
router.get("/get_request", requestController.getAllRequests)//Todo: Configure crew member auth
router.put("/update_request_status", requestController.updateRequestStatus)//Todo: Configure crew member auth
router.put("/", requireMemberAuth);

module.exports = router;




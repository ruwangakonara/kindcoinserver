const express = require('express');
const router = express.Router();

const requireMemberAuth = require('../Middleware/CrewMember/requireMemberAuth');

// const requireMemberAuth = require("../Middleware/CrewMember/RequireMemberAuth");
const requireCrewMemberAuth = require('../Middleware/CrewMember/requireMemberAuth');

const DonationController = require("../Controllers/CrewMember/donationController")
const TokenController = require("../Controllers/CrewMember/tokenController2")
const donationProof = require("../Controllers/CrewMember/donationProof");
const recepientController = require("../Controllers/CrewMember/recepientController");
const requestController = require("../Controllers/CrewMember/RequestController");



router.post("/transfer", TokenController.transfer)
router.post("/get_transaction", TokenController.getTransactionDetails)
// router.get("/xlm_to_lkr", TokenController.getXlmToLkrRate)
// router.get("/knd_to_xlm", TokenController.getTokenToXlmRate)
router.post("/dispatch", TokenController.dispatchTokens)
router.post("/verify_goods_donation", DonationController.verifyGoodsDonation)
router.post("/verify_monetary_donation", DonationController.verifyMonetaryDonation)

router.post("/verify_donation_doc", DonationController.verifyDonationDoc)



router.get("/get_donation_proof", donationProof.getAllDonations)
router.put("/update_donation_status", requireCrewMemberAuth, donationProof.updateDonationStatus)
router.get("/get_recepient",  recepientController.getAllBeneficiaries)
router.put("/update_recepient_status", recepientController.updateBeneficiaryStatus)
router.get("/get_request", requestController.getAllRequests)//Todo: Configure crew member auth
router.put("/update_request_status", requestController.updateRequestStatus)//Todo: Configure crew member auth

module.exports = router;

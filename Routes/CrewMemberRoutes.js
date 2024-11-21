const express = require('express');
const router = express.Router();
const requireMemberAuth = require("../Middleware/CrewMember/RequireMemberAuth");

const DonationController = require("../Controllers/CrewMember/donationController")
const TokenController = require("../Controllers/CrewMember/tokenController2")


router.post("/transfer", TokenController.transfer)
// router.get("/xlm_to_lkr", TokenController.getXlmToLkrRate)
// router.get("/knd_to_xlm", TokenController.getTokenToXlmRate)
router.post("/dispatch", TokenController.dispatchTokens)
router.post("/verify_goods_donation", DonationController.verifyGoodsDonation)
router.post("/verify_monetary_donation", DonationController.verifyMonetaryDonation)

router.post("/verify_donation_doc", DonationController.verifyDonationDoc)


module.exports = router;

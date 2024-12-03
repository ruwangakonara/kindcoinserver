const express = require("express");
const router = express.Router();

const requireMemberAuth = require("../Middleware/CrewMember/requireMemberAuth");

// const requireMemberAuth = require("../Middleware/CrewMember/RequireMemberAuth");
const requireCrewMemberAuth = require("../Middleware/CrewMember/requireMemberAuth");

const DonationController = require("../Controllers/CrewMember/donationController");
const TokenController = require("../Controllers/CrewMember/tokenController2");
const donationProof = require("../Controllers/CrewMember/donationProof");
const recepientController = require("../Controllers/CrewMember/recepientController");
const requestController = require("../Controllers/CrewMember/RequestController");
const adminController = require("../Controllers/Admin/donationController");
const goodsController = require("../Controllers/CrewMember/goodsController");


// router.get("/check-auth", (req, res, next) => {
//     requireMemberAuth(req, res, () => {
//         res.status(200).json({
//             authenticated: true,
//             user: {
//                 id: req.user._id,
//                 status: req.user.status
//             }
//         });
//     });
// });

// router.use(requireMemberAuth);

//requireCrewMemberAuth
router.post("/get_donations", DonationController.getDonations2)


router.post("/transfer", TokenController.transfer)
router.post("/get_transaction", TokenController.getTransactionDetails2)
// router.get("/xlm_to_lkr", TokenController.getXlmToLkrRate)
// router.get("/knd_to_xlm", TokenController.getTokenToXlmRate)
router.post("/dispatch", TokenController.dispatchTokens)
router.get("/get_balance", TokenController.getDistributorBalance)
router.post("/verify_goods_donation", DonationController.verifyGoodsDonation)
router.post("/verify_monetary_donation", DonationController.verifyMonetaryDonation)
//router.post("/goods_donations", adminController.getMemberDonations);
// router.get("/goods_donations", requireMemberAuth, adminController.getMemberDonations);
router.get("/goods_donations", goodsController.getMemberDonations);
router.put('/update-donation-status', requireMemberAuth, goodsController.updateDonationStatus);


router.post("/verify_donation_doc", DonationController.verifyDonationDoc);

//IMPORTANT: Add requireMemberAuth middleware to the routes below

router.get("/get_donation_proof", donationProof.getAllDonations)
router.put("/update_donation_status", donationProof.updateDonationStatus)
router.get("/get_recepient",  recepientController.getAllBeneficiaries)
router.put("/update_recepient_status",recepientController.updateBeneficiaryStatus)
router.get("/get_request", requestController.getAllRequests)//Todo: Configure crew member auth
router.put("/update_request_status", requestController.updateRequestStatus)//Todo: Configure crew member auth

module.exports = router;

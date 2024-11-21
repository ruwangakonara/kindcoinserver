const express = require('express');
const router = express.Router();
const requireBeneficiaryAuth = require('../Middleware/Beneficiary/requireBeneficiaryAuth');

const accountController = require("../Controllers/Beneficiary/accountController");
const uploader = require("../Middleware/Beneficiary/uploader");
const uploader_request = require("../Middleware/Beneficiary/uploader_request");
const announcementController = require("../Controllers/Beneficiary/annoucementController");
const requestController = require("../Controllers/Beneficiary/requestController");
const ticketController = require('../Controllers/Beneficiary/ticketController');
const userController = require("../Controllers/Beneficiary/userController");
const otherRequestController = require("../Controllers/Beneficiary/otherRequestController");
const donationController = require("../Controllers/Beneficiary/donationController");
const homeController = require("../Controllers/Beneficiary/HomeController.jsx");
const LeaderboardController = require("../Controllers/Beneficiary/leaderboardController");

// router.put("/update_account", requireBeneficiaryAuth, uploader.single("profileImage"), accountController.updateBeneficiary);
router.get("/get_account", requireBeneficiaryAuth, accountController.get_account);
router.put("/update_account",
    requireBeneficiaryAuth,
    uploader.fields([
        { name: 'profile_image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'certificate_image', maxCount: 1 }
    ]),
    accountController.updateBeneficiary);


router.get("/get_announcements", requireBeneficiaryAuth, announcementController.get_announcements);
router.post("/post_request", requireBeneficiaryAuth, requestController.createRequest)
router.post("/get_my_requests", requireBeneficiaryAuth, requestController.getMyRequests)
router.post("/get_my_request", requireBeneficiaryAuth, requestController.getRequest)
router.put("/update_request", requireBeneficiaryAuth,
    uploader_request.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
            { name: 'certificate_image', maxCount: 1 }
    ]),requestController.updateRequest)

router.post("/close_request", requireBeneficiaryAuth, requestController.closeRequest)


router.post("/get_requests", requireBeneficiaryAuth, otherRequestController.getRequests)
router.post("/getrequest", requireBeneficiaryAuth, otherRequestController.getRequestyo)

router.get("/get_tickets", requireBeneficiaryAuth, ticketController.getTickets)
router.post("/raise_ticket", requireBeneficiaryAuth, ticketController.raiseTicket)
router.put("/update_ticket", requireBeneficiaryAuth, ticketController.updateTicket)
router.post("/delete_ticket", requireBeneficiaryAuth, ticketController.deleteTicket)

router.get("/get_donors", requireBeneficiaryAuth, userController.getDonors)
router.get("/get_beneficiaries", requireBeneficiaryAuth, userController.getBeneficiaries)
router.post("/get_donor", requireBeneficiaryAuth, userController.getDonor)
router.post("/get_beneficiary", requireBeneficiaryAuth, userController.getBeneficiary)

router.post("/get_donations", requireBeneficiaryAuth, donationController.getDonations2)
router.post("/get_donation", requireBeneficiaryAuth, donationController.getDonation)
router.post("/accept_donation", requireBeneficiaryAuth, donationController.acceptDonation)

router.get("/get_beneficiary_cards", requireBeneficiaryAuth, homeController.BeneficiaryCards)
router.post("/get_home_donations", requireBeneficiaryAuth, homeController.getDonations)
router.get("/get_home_donors", requireBeneficiaryAuth, homeController.getDonors)
router.get("/get_leader_donors", requireBeneficiaryAuth, LeaderboardController.getDonors)
router.post("/get_leader_donor",requireBeneficiaryAuth, LeaderboardController.getDonor)
router.post("/get_comments", requireBeneficiaryAuth, LeaderboardController.getComments)
router.post("/put_comment", requireBeneficiaryAuth, LeaderboardController.putComment)
router.put("/update_comment", requireBeneficiaryAuth, LeaderboardController.updateComment)
router.put("/delete_comment", requireBeneficiaryAuth, LeaderboardController.deleteComment)

module.exports = router;
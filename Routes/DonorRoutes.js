const express = require('express');
const maintenanceController = require("../Controllers/Donor/maintenanceController");
const requireDonorAuth = require("../Middleware/Donor/requireDonorAuth");
const router = express.Router();
const accountController = require("../Controllers/Donor/accountController");
const uploader = require("../middleware/Donor/uploader");
const uploader_donation = require("../middleware/Donor/uploader_donation");
const announcementController = require("../Controllers/Donor/annoucementController");
const requestController = require("../Controllers/Donor/requestController");
const donationController = require("../Controllers/Donor/DonationController");
const ticketController = require('../Controllers/Donor/ticketController');
const userController = require("../Controllers/Donor/userController");


router.post("/maintenance_done", requireDonorAuth, maintenanceController.maintenance_done);
router.post("/get_maintenance", requireDonorAuth, maintenanceController.get_maintenance);

router.put("/update_account", requireDonorAuth, uploader.single("profileImage"), accountController.updateDonor);
router.get("/get_account", requireDonorAuth, accountController.get_account);

router.get("/get_announcements", requireDonorAuth, announcementController.get_announcements);

router.post("/get_requests", requireDonorAuth, requestController.getRequests)
router.post("/getrequest", requireDonorAuth, requestController.getRequestyo)

router.post("/create_donation", requireDonorAuth, donationController.createDonation);
router.post("/get_donations", requireDonorAuth, donationController.getDonations);
router.post("/get_donation", requireDonorAuth, donationController.getDonation);
router.put("/update_donation", requireDonorAuth, donationController.updateDonation);
router.put("/update_doc_transac_id", requireDonorAuth, donationController.updateDocTraID);
router.put("/update_donation_image", requireDonorAuth,uploader_donation.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), donationController.updateImages);

router.get("/get_tickets", requireDonorAuth, ticketController.getTickets)
router.post("/raise_ticket", requireDonorAuth, ticketController.raiseTicket)
router.put("/update_ticket", requireDonorAuth, ticketController.updateTicket)
router.post("/delete_ticket", requireDonorAuth, ticketController.deleteTicket)

router.get("/get_donors", requireDonorAuth, userController.getDonors)
router.get("/get_beneficiaries", requireDonorAuth, userController.getBeneficiaries)
router.post("/get_donor", requireDonorAuth, userController.getDonor)
router.post("/get_beneficiary", requireDonorAuth, userController.getBeneficiary)

module.exports = router;
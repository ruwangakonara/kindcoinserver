const express = require('express');
const maintenanceController = require("../Controllers/Donor/maintenanceController");
const requireDonorAuth = require("../Middleware/Donor/requireDonorAuth");
const router = express.Router();
const accountController = require("../Controllers/Donor/accountController");
const uploader = require("../middleware/Donor/uploader");
const announcementController = require("../Controllers/Donor/annoucementController");

router.post("/maintenance_done", requireDonorAuth, maintenanceController.maintenance_done);
router.post("/get_maintenance", requireDonorAuth, maintenanceController.get_maintenance);
router.put("/update_account", requireDonorAuth, uploader.single("profileImage"), accountController.updateDonor);
router.get("/get_account", requireDonorAuth, accountController.get_account);
router.get("/get_announcements", requireDonorAuth, announcementController.get_announcements);


module.exports = router;
const express = require("express");
const UserController = require("../Controllers/Home/UserController");
const requireAuth = require("../Middleware/requireAuth");
const router = express.Router();
const RazorController = require("../Controllers/Home/textrazorController");
const LeaderboardController = require("../Controllers/Home/leadeboardController");

router.post("/signin", UserController.signin);
router.get("/signout", UserController.signout);
router.post("/signup", UserController.signup);
router.get("/check-auth",requireAuth, UserController.checkAuth)
router.post("/beneficiary_registration", UserController.beneficiary_registration)
router.post("/textrazor", RazorController.textrazor)
router.get("/get-donors", LeaderboardController.getDonors)
router.post("/get-donor", LeaderboardController.getDonor)
router.post("/get-comments", LeaderboardController.getComments)

// registration endpoint for crew member. this has been migrated to the admin crew member controller
router.post("/crew_memeber_signup", UserController.crewMember_registration);
router.post("/admin_signup", UserController.admin_signup);

module.exports = router;

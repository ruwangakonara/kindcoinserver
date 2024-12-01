const express = require("express");
const UserController = require("../Controllers/Home/UserController");
const requireAuth = require("../Middleware/requireAuth");
const router = express.Router();
const RazorController = require("../Controllers/Home/textrazorController");
const LeaderboardController = require("../Controllers/Home/leadeboardController");
const QueryController = require('../Controllers/Home/queryController');
const ForgotController = require("../Controllers/Home/forgotController");

router.post("/signin", UserController.signin);
router.get("/signout", UserController.signout);
router.post("/signup", UserController.signup);
router.get("/check-auth",requireAuth, UserController.checkAuth)
router.post("/beneficiary_registration", UserController.beneficiary_registration)
router.post("/textrazor", RazorController.textrazor)
router.get("/get-donors", LeaderboardController.getDonors)
router.post("/verify", UserController.verify)
router.post("/get-donor", LeaderboardController.getDonor)
router.post("/get-comments", LeaderboardController.getComments)
router.post("/query", QueryController.insertQuery)
router.post("/forgot", ForgotController.forgotPassword)
router.post("/reset", ForgotController.resetPassword)

// registration endpoint for crew member. this has been migrated to the admin crew member controller
// router.post("/crew_memeber_signup", UserController.crewMember_registration);
router.post("/admin_signup", UserController.admin_signup);

module.exports = router;

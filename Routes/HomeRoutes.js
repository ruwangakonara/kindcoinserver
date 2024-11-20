const express = require("express");
const UserController = require("../Controllers/Home/UserController");
const requireAuth = require("../Middleware/requireAuth");
const router = express.Router();

router.post("/signin", UserController.signin);
router.get("/signout", UserController.signout);
router.post("/signup", UserController.signup);
//
router.get("/check-auth", requireAuth, UserController.checkAuth);
router.post(
  "/beneficiary_registration",
  UserController.beneficiary_registration
);
// registration endpoint for crew member. this has been migrated to the admin crew member controller
router.post("/crew_memeber_signup", UserController.crewMember_registration);
router.post("/admin_signup", UserController.admin_signup);

module.exports = router;

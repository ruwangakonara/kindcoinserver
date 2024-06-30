const express = require('express');
const UserController = require("../Controllers/Home/UserController");
const requireAuth = require("../Middleware/requireAuth");
const router = express.Router();


router.post('/signin', UserController.signin);
router.get('/signout', UserController.signout);
router.post("/signup", UserController.signup);
router.get("/check-auth",requireAuth, UserController.checkAuth)
router.post("/beneficiary_registration", UserController.beneficiary_registration)

module.exports = router;

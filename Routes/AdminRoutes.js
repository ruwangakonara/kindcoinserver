// view all users
// view all donations
// view all tokens
// view all beneficiaries
// view all requests
// remove unethical recipients

const express = require('express');
const router = express.Router();
const AdminController = require("../Controllers/Home/AdminController");

router.get('/allusers', AdminController.getAllUsers);
router.get('/alldonations', AdminController.getAllDonations);
router.get('/alltokens', AdminController.getAllTokens);
router.get('/allbeneficiaries', AdminController.getAllBeneficiaries);
router.get('/allrequests', AdminController.getAllRequests);
router.delete('/removeuser/:id', AdminController.removeUser);

module.exports = router
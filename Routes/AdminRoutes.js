// view all users
// view all crew members
// view all beneficiaries
// view all donors
// view all donations
// view all tokens
// view all requests
// remove unethical recipients

const express = require("express");
const router = express.Router();
const AdminController = require("../Controllers/Admin/AdminController");

// router.get("/allusers", AdminController.getAllUsers);
router.get("/alldonations", AdminController.getAllDonations);
router.get("/alltokens", AdminController.getAllTokens);
router.get("/allbeneficiaries", AdminController.getAllBeneficiaries);
router.get("/allrequests", AdminController.getAllRequests);
router.delete("/removeuser/:id", AdminController.removeUser);

console.log(AdminController.getAllUsers); // Should not be undefined
console.log(AdminController.getAllDonations); // Should not be undefined

module.exports = router;

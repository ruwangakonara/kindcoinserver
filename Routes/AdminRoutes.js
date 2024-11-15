// view all users

// view all donors
// view all donations
// view all tokens
// view all requests
// remove unethical recipients

const express = require("express");
const router = express.Router();
const requireAdminAuth = require("../Middleware/Admin/requireAdminAuth");

// const AdminController = require("../Controllers/Admin/AdminController");
const AdminCrewMemController = require("../Controllers/Admin/AdminCMemberController");
const BeneficiaryController = require("../Controllers/Admin/AdminBeneController");

// beneficiaries routes - getAll, getone, update, deactivate, remove
// view all beneficiaries
router.get(
  "/Beneficiary_List/Beneficiaries",
  BeneficiaryController.getAllBeneficiaries
);
router.get(
  "/Beneficiary_List/Beneficiaries/:id",
  BeneficiaryController.getBeneficiary
);
router.put(
  "/Beneficiary_List/Beneficiaries/:id",
  BeneficiaryController.updateBeneficiary
);
router.put(
  "/Beneficiary_List/Beneficiaries/deactivate/:id",
  BeneficiaryController.deactivateBeneficiary
);
router.delete(
  "/Beneficiary_List/Beneficiaries/:id",
  BeneficiaryController.removeBeneficiary
);

// donors routes - getone, getAll, update, deactivate, remove

// crew members routes - create, getone, getAll, update, deactivate, remove
router.post("/register/crew_member", AdminCrewMemController.crewMember_signup);
// view all crew members
router.get("/view/crew_member", AdminCrewMemController.view_crewMembers);
router.post(
  "/assign/crew_member",
  AdminCrewMemController.crewMember_assignTask
);

// complaints routes - getOne, getAll another operations.

// statistics routes -

// announcements routes - createForBene, createForDon, UpdateForBene, UpdateForDon, RemoveForBene,RemoveForDon,RemoveAllForBene, RemoveAllForDon

//admin routes - get account details -/account

// router.get("/allusers", AdminController.getAllUsers);
// router.get("/alldonations", requireAdminAuth, AdminController.getAllDonations);
// router.get("/alltokens", requireAdminAuth, AdminController.getAllTokens);
// router.get(
//   "/allbeneficiaries",
//   requireAdminAuth,
//   AdminController.getAllBeneficiaries
// );
// router.get("/allrequests", requireAdminAuth, AdminController.getAllRequests);
// router.delete("/removeuser/:id", requireAdminAuth, AdminController.removeUser);

// console.log(AdminController.getAllUsers); // Should not be undefined
// console.log(AdminController.getAllDonations); // Should not be undefined

module.exports = router;

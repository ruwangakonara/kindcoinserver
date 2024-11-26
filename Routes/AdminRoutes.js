const express = require("express");
const router = express.Router();

// middleware auth for admin
const requireAdminAuth = require("../Middleware/Admin/requireAdminAuth");

const AdminAccountController = require("../Controllers/Admin/AdminAccountController");
const AdminCrewMemController = require("../Controllers/Admin/AdminCMemberController");
const AdminBeneficiaryController = require("../Controllers/Admin/AdminBeneController");
const AdminDonorController = require("../Controllers/Admin/AdminDonController");
const AdminAnnouncementController = require("../Controllers/Admin/AdminAnnoucementController");
const AdminTicketsController = require("../Controllers/Admin/AdminTicketsController");
const AdminReqController = require("../Controllers/Admin/AdminReqController");

/**
 * #####################################################################################
 * beneficiaries routes - getAll, getone, update, deactivate, remove
 * #####################################################################################
 */
router.get(
  "/Beneficiary_List/Beneficiaries",
  AdminBeneficiaryController.getAllBeneficiaries
);
router.get(
  "/Beneficiary_List/Beneficiaries/:id",
  AdminBeneficiaryController.getBeneficiary
);
router.put(
  "/Beneficiary_List/Beneficiaries/:id",
  AdminBeneficiaryController.updateBeneficiary
);
router.put(
  "/Beneficiary_List/Beneficiaries/deactivate/:id",
  AdminBeneficiaryController.deactivateBeneficiary
);
router.delete(
  "/Beneficiary_List/Beneficiaries/:id",
  AdminBeneficiaryController.removeBeneficiary
);

/**
 * #####################################################################################
 * donors routes - getone, getAll, update, deactivate, remove
 * #####################################################################################
 */
router.get("/Donor_List/Donors", AdminDonorController.getAllDonors);
router.get("/Donor_List/Donors/:id", AdminDonorController.getDonor);
router.put("/Donor_List/Donors/:id/edit", AdminDonorController.updateDonor);
router.put(
  "/Donor_List/Donors/deactivate/:id",
  AdminDonorController.deactivateDonor
);
router.delete("/Donor_List/Donors/:id", AdminDonorController.removeDonor);

/**
 * #####################################################################################
 * crew members routes - create, getone, getAll, update, deactivate, remove
 * #####################################################################################
 */
router.post("/register/crew_member", AdminCrewMemController.crewMember_signup);
router.get("/view/crew_member", AdminCrewMemController.view_crewMembers);
router.post(
  "/assign/crew_member",
  AdminCrewMemController.crewMember_assignTask
);

/**
 * #####################################################################################
 * complaints routes - getOne, getAll another operations.
 * #####################################################################################
 */

/**
 * #####################################################################################
 * statistics routes - getTotalDonations, getDonationsByDonor, receivedDonationsByBeneficiary
 * #####################################################################################
 */

/**
 * #####################################################################################
 * announcements routes - getAll, getBenAll, getDonAll, createOne, updateOne, deleteAll, deleteOne
 * #####################################################################################
 */
router.get(
  "/handle/announcements",
  AdminAnnouncementController.get_all_announcements
);
router.get(
  "/handle/announcements/beneficiary",
  AdminAnnouncementController.get_beneficiary_announcements
);
router.get(
  "/handle/announcements/donor",
  AdminAnnouncementController.get_donor_announcements
);
router.post(
  "/handle/announcements/create",
  AdminAnnouncementController.create_announcements
);
router.put(
  "/handle/announcements/update/:id",
  AdminAnnouncementController.update_announcement
);
router.delete(
  "/handle/announcements/delete",
  AdminAnnouncementController.delete_all_announcements
);
router.delete(
  "/handle/announcements/deleteOne/:id",
  AdminAnnouncementController.delete_old_single_announcement
);

/**
 * #####################################################################################
 * admin routes - get account details, update account details
 * #####################################################################################
 */
router.get(
  "/account",
  // requireAdminAuth,
  AdminAccountController.getAdminAccount
);
router.put("/account/update", AdminAccountController.updateAdmin);

/**
 * #####################################################################################
 * Tickets routes - getAllTickets,
 * #####################################################################################
 */

router.get("/tickets", AdminTicketsController.getAllTickets);

/**
 * #####################################################################################
 * Tokens routes - getAllTokens
 * #####################################################################################
 */
// router.get("/tokens", AdminTicketsController.getAllTokens);

/**
 * #####################################################################################
 * Requests routes - getAllRequests
 * #####################################################################################
 */
router.get("/requests", AdminReqController.getAllRequests);

module.exports = router;

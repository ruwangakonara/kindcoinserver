// const User = require("../../models/user");
const Donation = require("../../models/donation");
// const Token = require("../../models/token");
const Beneficiary = require("../../models/beneficiary");
const Request = require("../../models/request");
const Admin = require("../../models/admin");

// router.get('/alldonations', AdminController.getAllDonations);
// router.get('/alltokens', AdminController.getAllTokens);
// router.get('/allbeneficiaries', AdminController.getAllBeneficiaries);
// router.get('/allrequests', AdminController.getAllRequests);
// router.delete("/removeuser:id", AdminController.removeUser);

const getAllDonations = async (req, res) => {
  try {
    const donations = Donation.find(req.body);
    res.status(200).json({ requests: donations });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = Beneficiary.find(req.body);
    res.status(200).json({ requests: beneficiaries });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = Request.find(req.body);
    res.status(200).json({ requests: requests });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllDonations,
  getAllBeneficiaries,
  getAllRequests,
};

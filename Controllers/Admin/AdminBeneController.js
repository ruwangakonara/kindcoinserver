const User = require("../../models/user");
const Beneficiary = require("../../models/beneficiary");

// logic to get all the beneficiaries, get a single beneficiary details, remove beneficiary from the system

async function getAllBeneficiaries(req, res) {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json({ beneficiaries: beneficiaries });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getBeneficiary(req, res) {
  try {
    const { user_id } = req.body;
    const beneficiary = await Beneficiary.findOne(user_id);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function updateBeneficiary(req, res) {
  try {
    const { user_id } = req.body;
    const beneficiary = await Beneficiary.findOneAndUpdate(user_id, req.body);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// this will be used to temporarily deactivate the user from the system.
async function deactivateBeneficiary(req, res) {
  try {
    const { user_id } = req.body;
    const beneficiary = await Beneficiary.findOneAndDelete(user_id);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function removeBeneficiary(req, res) {
  try {
    const { user_id } = req.body;
    const beneficiary = await Beneficiary.findOneAndDelete(user_id);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  getAllBeneficiaries,
  getBeneficiary,
  updateBeneficiary,
  deactivateBeneficiary,
  removeBeneficiary,
};

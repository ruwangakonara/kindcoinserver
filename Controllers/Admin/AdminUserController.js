// get all users, remove user from system.

const User = require("../../models/user");
const UserController = require("../Home/UserController");
const Donor = UserController.Donor;
const Beneficiary = UserController.Beneficiary;
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const users = User.deleteOne(req.params.id);
    console.log("user fetched");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

async function getDonors(req, res) {
  try {
    const donors = await Donor.find();
    res.status(200).json({ donors: donors });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getBeneficiaries(req, res) {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json({ beneficiaries: beneficiaries });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getDonor(req, res) {
  try {
    const donor = await Donor.findOne(req.body);
    res.status(200).json({ donor: donor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getBeneficiary(req, res) {
  try {
    console.log("tyo");

    const beneficiary = await Beneficiary.findOne(req.body);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  getAllUsers,
  removeUser,
  getBeneficiaries,
  getDonors,
  getDonor,
  getBeneficiary,
};

const User = require("../../models/user");
const Donor = require("../../models/donor");

//getone, getAll, update, deactivate, remove

async function getAllDonors(req, res) {
  try {
    const donors = await Donor.find();
    console.log(donors);
    res.status(200).json({ donors: donors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

async function getDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOne(user_id);
    console.log(donor);
    res.status(200).json({ donor: donor });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

async function updateDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOneAndUpdate(user_id, req.body);
    res.status(200).json({ donor: donor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function deactivateDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOneAndDelete(user_id);
    res.status(200).json({ donor: donor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function removeDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOneAndDelete(user_id);
    res.status(200).json({ donor: donor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  getAllDonors,
  getDonor,
  updateDonor,
  deactivateDonor,
  removeDonor,
};

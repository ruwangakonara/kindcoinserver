const User = require("../../models/user");
const Donor = require("../../models/donor");

//getone, getAll, update, deactivate, remove

async function getAllDonors(req, res) {
  try {
    const donors = await Donor.find().populate("user_id");
    console.log(donors);
    res.status(200).json(donors);
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
    res.status(200).json(donor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

async function updateDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOneAndUpdate(user_id, req.body);
    console.log("successfully update the donor");
    res.status(200).json(donor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

async function deactivateDonor(req, res) {
  try {
    const { user_id } = req.body;
    const donor = await Donor.findOneAndUpdate(user_id);
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// remove Donor has some issues to be fixed. #########################
async function removeDonor(req, res) {
  try {
    const { user_id } = req.body;
    console.log("removeDonor In");

    // First, find and delete the donor based on the user_id reference
    const donor = await Donor.findOneAndDelete(user_id);

    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    // Then, find and delete the user by their _id
    const donorUser = await User.findByIdAndDelete(user_id);

    if (!donorUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return both donor and user data in the response
    res.status(200).json({
      message: "Donor and user deleted successfully",
      donor,
      donorUser,
    });
    console.log("removeDonor Out with success");
  } catch (error) {
    console.log(error);
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

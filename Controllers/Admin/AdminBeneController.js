const User = require("../../models/user");
const Beneficiary = require("../../models/beneficiary");

// logic to get all the beneficiaries, get a single beneficiary details, remove beneficiary from the system

/* TESTED */
async function getAllBeneficiaries(req, res) {
  try {
    // Fetch all beneficiaries and populate all user fields
    const beneficiaries = await Beneficiary.find().populate("user_id");
    // const beneficiaries = await Beneficiary.find();

    // Respond with the list of beneficiaries including the full user data
    res.status(200).json(beneficiaries);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

/* TESTED */
async function getBeneficiary(req, res) {
  try {
    const { beneficiary_id } = req.params.id;
    const beneficiary = await Beneficiary.findOne(beneficiary_id).populate(
      "user_id"
    );
    res.status(200).json(beneficiary);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

const updateFields = (object, updates, fields) => {
  fields.forEach((field) => {
    if (updates[field] !== undefined) {
      object[field] = updates[field];
    }
  });
};

async function updateBeneficiary(req, res) {
  try {
    const {
      name,
      username,
      image1,
      image2,
      image3,
      profile_image,
      certificate_image,
      type,
      date_of_birth,
      district,
      phoneNo,
      verified,
      raised_amount,
      isEthical,
      password,
    } = req.body;

    const { beneficiary_id } = req.params; // Fixed destructuring error

    // Find the beneficiary by ID
    const beneficiary = await Beneficiary.findById(beneficiary_id).populate(
      "user_id"
    );

    if (!beneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    // Update beneficiary fields
    const beneficiaryFields = [
      "name",
      "username",
      "image1",
      "image2",
      "image3",
      "profile_image",
      "certificate_image",
      "type",
      "date_of_birth",
      "district",
      "phoneNo",
      "verified",
      "raised_amount",
    ];
    updateFields(beneficiary, req.body, beneficiaryFields);

    // Find the associated user
    const beneficiaryUser = await User.findById(beneficiary.user_id);

    if (!beneficiaryUser) {
      return res.status(404).json({ error: "Associated user not found" });
    }

    // Update user fields
    const userFields = ["username", "isEthical"];
    updateFields(beneficiaryUser, req.body, userFields);

    // If a password update is requested, hash the password before saving (if applicable)
    if (password !== undefined) {
      // Assuming you use a hashing library like bcrypt
      // const hashedPassword = await bcrypt.hash(password, saltRounds);
      // beneficiaryUser.password = hashedPassword;

      beneficiaryUser.password = password; // Keep this only if password hashing is handled elsewhere
    }

    // Save the updated user and beneficiary
    await beneficiaryUser.save();
    await beneficiary.save();

    console.log("User and Beneficiary updated successfully");

    // if (name !== undefined) beneficiary.name = name;
    // if (username !== undefined) beneficiary.username = username;
    // if (image1 !== undefined) beneficiary.image1 = image1;
    // if (image2 !== undefined) beneficiary.image2 = image2;
    // if (image3 !== undefined) beneficiary.image3 = image3;
    // if (profile_image !== undefined) beneficiary.profile_image = profile_image;
    // if (certificate_image !== undefined)
    //   beneficiary.certificate_image = certificate_image;
    // if (type !== undefined) beneficiary.type = type;
    // if (date_of_birth !== undefined) beneficiary.date_of_birth = date_of_birth;
    // if (district !== undefined) beneficiary.district = district;
    // if (phoneNo !== undefined) beneficiary.phoneNo = phoneNo;
    // if (verified !== undefined) beneficiary.verified = verified;
    // if (raised_amount !== undefined) beneficiary.raised_amount = raised_amount;

    // const beneficiaryUser = await User.findOne(beneficiary.user_id);
    // if (isEthical !== undefined) beneficiaryUser.isEthical = isEthical;
    // if (username !== undefined) beneficiaryUser.username = username;
    // if (password !== undefined) beneficiaryUser.password = password;

    // await beneficiaryUser.save();
    // console.log("user updated");
    // await beneficiary.save();

    // Send a success response
    res.status(200).json({ beneficiary });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

// this will be used to temporarily deactivate the user from the system.
async function deactivateBeneficiary(req, res) {
  try {
    const { beneficiary_id } = req.params.id;
    const beneficiary = await Beneficiary.findOne(beneficiary_id);
    // const beneficiary = await Beneficiary.findOneAndDelete(user_id);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

async function removeBeneficiary(req, res) {
  try {
    const { user_id } = req.params.id;
    const beneficiary = await Beneficiary.findOneAndDelete(user_id);
    res.status(200).json({ beneficiary: beneficiary });
  } catch (error) {
    console.log(error);
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

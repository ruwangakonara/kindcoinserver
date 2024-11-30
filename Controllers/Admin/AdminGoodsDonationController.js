const CrewMember = require("../Home/UserController").Member;
const donation = require("../Donor/donation_cycle_break");
const Donations = donation.Donation;

async function assign_Goods_Donation_To_Member(req, res) {
  //   console.log("Viewing all donations");

  try {
    const { id1, id2 } = req.params;

    console.log(id1, id2);

    // Fetch the goods donation based on id1
    const donation = await Donation.findById(id1);
    console.log(donation);
    if (!donation) {
      return res.status(404).json({ message: "Goods donation not found" });
    }

    // Check if the donation is of type 'goods'
    if (donation.type !== "Goods") {
      return res
        .status(400)
        .json({ message: "This donation is not of type 'goods'" });
    }

    // Fetch the crew member based on id2
    const member = await Member.findById(id2);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Assign the member to the donation
    donation.member_id = member.user_id;

    // Save the updated donation
    await donation.save();

    // Return the updated donation
    return res.status(200).json({
      message: "Crew member successfully assigned to the goods donation",
      donation,
    });
  } catch (error) {
    // Handle errors
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  assign_Goods_Donation_To_Member,
};

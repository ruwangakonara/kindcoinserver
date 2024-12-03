// const Donation = require("../../models/donation");
const UserController = require("../Home/UserController");
const Donation =
  require("../../Controllers/Donor/donation_cycle_break").Donation;
const Request = require("../Beneficiary/request_cycle_breaker").Request;
const Donor = UserController.Donor;
const Beneficiary = UserController.Beneficiary;

const getSummary = async (req, res) => {
  try {
    // Aggregating donation data
    const donationSummary = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalDonations: { $sum: "$value" },
          totalDonors: { $count: {} },
        },
      },
    ]);

    console.log(donationSummary);

    // Aggregating beneficiary data
    const beneficiarySummary = await Beneficiary.aggregate([
      {
        $group: {
          _id: "$status",
          totalRaised: { $sum: "$raised_amount" },
          totalBeneficiaries: { $count: {} },
        },
      },
    ]);

    console.log(beneficiarySummary);

    // Aggregating donor data
    const donorSummary = await Donor.aggregate([
      {
        $group: {
          _id: null,
          totalDonated: { $sum: "$donated" },
          totalDonors: { $count: {} },
          totalTokens: { $sum: "$tokens" },
        },
      },
    ]);

    console.log(donorSummary);

    // Aggregating request data
    const requestSummary = await Request.aggregate([
      {
        $group: {
          _id: "$status",
          totalRaised: { $sum: "$raised" },
          totalRequests: { $count: {} },
        },
      },
    ]);

    console.log(requestSummary);

    // Prepare a summary report
    const report = {
      donationSummary: donationSummary[0] || {
        totalDonations: 0,
        totalDonors: 0,
      },
      beneficiarySummary: beneficiarySummary,
      donorSummary: donorSummary[0] || {
        totalDonated: 0,
        totalDonors: 0,
        totalTokens: 0,
      },
      requestSummary: requestSummary,
    };
    console.log("This is the Report:", report);
    res.status(200).json(report);
    // return report;
  } catch (error) {
    throw new Error("Error generating summary: " + error.message);
  }
};

const getBeneficiaryReport = async (req, res) => {
  // Example filter criteria to get only approved and verified beneficiaries
  const filterCriteria = { status: "Approved", verified: true };

  try {
    const results = await Beneficiary.aggregate([
      { $match: filterCriteria },
      {
        $lookup: {
          from: "requests",
          localField: "_id",
          foreignField: "beneficiary_id",
          as: "requests",
        },
      },
      { $unwind: { path: "$requests", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          district: { $first: "$district" },
          phoneNo: { $first: "$phoneNo" },
          verified: { $first: "$verified" },
          status: { $first: "$status" },
          created_at: { $first: "$created_at" },
          raised_amount: { $sum: "$requests.amount" },
        },
      },
      {
        $project: {
          username: 1,
          district: 1,
          phoneNo: 1,
          verified: 1,
          status: 1,
          created_at: 1,
          raised_amount: 1,
        },
      },
    ]);
    console.log(results);
    res.status(200).json(results);
    // return results;
  } catch (error) {
    console.error("Error retrieving beneficiaries:", error);
    throw error;
  }
};

const getDonationsWithDonorDetails = async (req, res) => {
  const filterCriteria = {
    verified: true,
    reward: false,
    type: { $in: ["monetary", "goods"] }, // Match both "monetary" and "goods"
    donation_date: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Donations in the last 6 months
    },
  };

  try {
    const results = await Donation.aggregate([
      { $match: filterCriteria },
      {
        $lookup: {
          from: "donors",
          localField: "donor_id",
          foreignField: "_id",
          as: "donorDetails",
        },
      },
      { $unwind: "$donorDetails" },
      {
        $project: {
          donation_id: "$_id",
          amount: 1,
          value: 1,
          donation_date: 1,
          created: 1,
          rewarded: 1,
          goods: 1,
          attestation_fee: 1,
          images: 1,
        },
      },
    ]);
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwww", results);
    res.status(200).json(results);
    // return results;
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error retrieving donations with donor details:", error);
    throw error;
  }
};

module.exports = {
  getSummary,
  getDonationsWithDonorDetails,
  getBeneficiaryReport,
};

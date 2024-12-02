// const Donation = require("../../models/donation");
const UserController = require("../Home/UserController");
const Donation =
  require("../../Controllers/Donor/donation_cycle_break").Donation;
const Request = require("../Beneficiary/request_cycle_breaker").Request;
const Donor = UserController.Donor;
const Beneficiary = UserController.Beneficiary;

async function getSummary() {
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

    return report;
  } catch (error) {
    throw new Error("Error generating summary: " + error.message);
  }
}

async function getBeneficiaryReport(filterCriteria) {
  try {
    const results = await Beneficiary.aggregate([
      { $match: filterCriteria },
      {
        $lookup: {
          from: "requests",
          localField: "beneficiary_id",
          foreignField: "_id",
          as: "requests",
        },
      },
      { $unwind: "$requests" },
      {
        $project: {
          name: 1,
          email: 1,
          "requests.title": 1,
          "requests.description": 1,
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error retrieving beneficiaries:", error);
    throw error;
  }
}

async function getDonationsWithDonorDetails() {
  const filterCriteria = {
    verified: true,
    reward: false,
    type: "monetary",
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
          donation_id: 1,
          title: 1,
          description: 1,
          amount: 1,
          value: 1,
          donation_date: 1,
          "donorDetails.name": 1,
          "donorDetails.email": 1,
          phone: 1,
          email: 1,
          created: 1,
          verified: 1,
          rewarded: 1,
          goods: 1,
          attestation_fee: 1,
          images: 1,
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error retrieving donations with donor details:", error);
    throw error;
  }
}

module.exports = {
  getSummary,
  getDonationsWithDonorDetails,
  getBeneficiaryReport,
};

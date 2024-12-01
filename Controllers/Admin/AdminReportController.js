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
    console.log(report);

    return report;
  } catch (error) {
    throw new Error("Error generating summary: " + error.message);
  }
}

module.exports = { getSummary };

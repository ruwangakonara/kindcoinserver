const Announcement = require("../../models/announcement");

/** TESTED */
async function create_announcements(req, res) {
  try {
    const dateNow = new Date(); // This will give you the current date and time as a Date object
    // donor, beneficiary specifies whom to be shown in a boolean type.If both true it is a general announcement.
    const { title, body, donor, beneficiary } = req.body;

    const announcement = await Announcement.create({
      title,
      body,
      donor,
      beneficiary,
      created: dateNow,
    });
    console.log("Announcement created successfully");
    res.status(201).json({ announcement });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function create_announcement_for_good_donations(req, res) {
  try {
    const dateNow = new Date(); // This will give you the current date and time as a Date object
    // donor, beneficiary specifies whom to be shown in a boolean type.If both true it is a general announcement.
    const { title, body, donor, beneficiary } = req.body;

    const announcement = await Announcement.create({
      title,
      body,
      donor,
      beneficiary,
      created: dateNow,
    });
    console.log("Announcement created successfully");
    res.status(201).json({ announcement });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function update_announcement(req, res) {
  try {
    const { title, body, donor, beneficiary } = req.body;
    const announcement_id = req.params.id;

    // Find the announcement by ID
    const announcement = await Announcement.findById(announcement_id);

    // Update the fields that are present in the request
    if (title !== undefined) announcement.title = title;
    if (body !== undefined) announcement.body = body;

    // Update donor if it's passed in the request (true/false)
    if (donor !== undefined) {
      console.log("Donor:", donor);
      announcement.donor = donor;
    }

    // Update beneficiary if it's passed in the request (true/false)
    if (beneficiary !== undefined) {
      console.log("Beneficiary:", beneficiary);
      announcement.beneficiary = beneficiary;
    }

    await announcement.save();
    console.log("Announcement updated successfully");
    console.log(announcement);
    // Respond with the updated announcement
    res.status(200).json({ announcement });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function delete_old_single_announcement(req, res) {
  try {
    const announcement_id = req.params.id;
    await Announcement.findByIdAndDelete(announcement_id);
    console.log(`announcement ${announcement_id} deleted successfully`);
    res.status(200).json({ success: "Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function delete_all_announcements(req, res) {
  try {
    await Announcement.deleteMany({});
    console.log("All announcements deleted successfully");
    res.status(200).json({ success: "Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function get_beneficiary_announcements(req, res) {
  try {
    // logic to get the provided beneficiary announcements
    const announcements = await Announcement.find({ beneficiary: true });
    console.log(announcements);
    res.status(200).json({ announcements });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function get_donor_announcements(req, res) {
  try {
    // logic to get the provided beneficiary announcements
    const announcements = await Announcement.find({ donor: true });
    console.log(announcements);
    res.status(200).json({ announcements });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/** TESTED */
async function get_all_announcements(req, res) {
  try {
    const announcements = await Announcement.find();
    console.log(announcements);
    res.status(200).json(announcements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  create_announcements,
  update_announcement,
  delete_old_single_announcement,
  delete_all_announcements,
  get_beneficiary_announcements,
  get_donor_announcements,
  get_all_announcements,
  create_announcement_for_good_donations,
};

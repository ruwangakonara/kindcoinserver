const Announcement = require("../../models/announcement");

async function create_announcements(req, res) {
  try {
    const dateNow = new Date().toISOString().slice(0, 19).replace("T", " ");
    // donor, beneficiary specifies whom to be shown in a boolean type.
    const { title, annoncementBody, donor, beneficiary } = req.body;

    const announcement = await Announcement.create({
      title,
      body: annoncementBody,
      donor,
      beneficiary,
      created: dateNow,
    });

    res.status(201).json({ announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update_announcement(req, res) {
  try {
    const { title, annoncementBody, donor, beneficiary } = req.body;
    const announcement_id = req.params.id;
    const announcement = await Announcement.findById(announcement_id);
    announcement.title = title;
    announcement.body = annoncementBody;
    announcement.donor = donor;
    announcement.beneficiary = beneficiary;
    await announcement.save();
    res.status(200).json({ announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function delete_old_single_announcement(req, res) {
  try {
    const announcement_id = req.params.id;
    await Announcement.findByIdAndDelete(announcement_id);
    res.status(200).json({ success: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function delete_all_announcements(req, res) {
  try {
    await Announcement.deleteMany({});
    res.status(200).json({ success: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function get_beneficiary_announcements(req, res) {
  try {
    // logic to get the provided beneficiary announcements
    const announcements = await Announcement.find({ beneficiary: true });
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function get_donor_announcements(req, res) {
  try {
    // logic to get the provided beneficiary announcements
    const announcements = await Announcement.find({ beneficiary: true });
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function get_all_announcements(req, res) {
  try {
    const announcements = await Announcement.findAll();
    res.status(200).json({ announcements });
  } catch (error) {
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
};

const Announcement = require('../../models/announcement');


async function get_announcements(req, res) {

    try{
        const announcements = await Announcement.find({beneficiary: true});
        res.status(200).json({announcements});
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

module.exports = {
    get_announcements,
}
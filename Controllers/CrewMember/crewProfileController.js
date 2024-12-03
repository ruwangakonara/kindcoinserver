const Member = require("../../models/member");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


async function getCrewProfile(req, res) {
    try {
        const user_id = new mongoose.Types.ObjectId(req.sub);
        const member = await Member.findOne({ user_id });
        
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ 
            member: {
                name: member.name,
                username: member.username,
                crewId: member._id,
                profile_image: member.profile_image,
                phone: member.phone,
                noOfOperations: member.noOfOperations,
                areaDetails: member.areaDetails
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function updatePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const user_id = new mongoose.Types.ObjectId(req.sub);
        
        const member = await Member.findOne({ user_id });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, member.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        member.password = hashedPassword;
        await member.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function updateProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const user_id = new mongoose.Types.ObjectId(req.sub);
        // Store just the filename like in donation model
        const profile_image = req.file.filename;
        
        const member = await Member.findOneAndUpdate(
            { user_id },
            { profile_image },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ 
            message: 'Profile image updated',
            // Return full URL path like in donation proofs
            image: `http://localhost:9013/images/crew/${profile_image}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCrewProfile,
    updatePassword,
    updateProfileImage
};
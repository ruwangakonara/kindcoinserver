const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../../Controllers/Home/UserController').User; // Replace with your User model

const SECRET_KEY = process.env.SECRET || "your-secret-key"; // Replace with a secure key

async function forgotPassword(req, res) {
    const { email } = req.body;

    console.log(email)

    try {
        const user = await User.findOne({ username: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a JWT token valid for 1 hour
        const resetToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        // Send reset email
        const resetLink = `http://localhost:3000/forgot2/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kindcoinorg@gmail.com', // Your Gmail address
                pass: 'ebmw fjaq szww qswq',
            },
        });

        await transporter.sendMail({
            to: user.username,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>
                <p>If you did not request this, ignore this email.</p>
            `,
        });

        console.log("alright then")
        res.status(200).json({ message: 'Reset email sent' });

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function resetPassword(req, res) {
    console.log("rest now")
    const { token, password } = req.body;

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password without a salt
        const hashedPassword = bcrypt.hashSync(password, 1); // Salt rounds set to 1, effectively no salting

        // Update the user's password
        user.password = hashedPassword;
        await user.save();


        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Error in resetPassword:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Reset token expired' });
        }

        res.status(500).json({ message: 'Invalid or expired token' });
    }
}


module.exports = {
    resetPassword,
    forgotPassword
}
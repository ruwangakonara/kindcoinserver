const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
        user: 'kindcoinorg@gmail.com', // Your Gmail address
        pass: 'ebmw fjaq szww qswq',    // Your App Password (not your Gmail password)
    },
});


const sendVerificationEmail = async (toEmail, verificationLink, details, status) => {
    try {
        // Email content
        const mailOptions = {
            from: '"KindCoin Support" <your-email@gmail.com>', // Sender's email
            to: toEmail,                                       // Recipient's email
            subject: 'Email Verification for KindCoin',
            html: `
        <h1>Email Verification</h1>
        <p>Thank you ${details.name} for registering with KindCoin as a ${status}. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="color: blue;">Verify Email</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>Best regards, <br> The KindCoin Team</p>
      `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};


module.exports = {
    transporter,
    sendVerificationEmail
}
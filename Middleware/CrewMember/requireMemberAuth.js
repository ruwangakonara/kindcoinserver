const jwt = require("jsonwebtoken");
const User = require("../../models/user");

async function requireMemberAuth(req, res, next) {
    try {
        const token = req.cookies.Authorization;
        if (!token) {
            console.log("no cookie")
            return res.sendStatus(401); // Unauthorized if no token is present
        }

        const decoded = jwt.verify(token, process.env["SECRET"]);
        if (Date.now() > decoded.exp * 1000) {
            return res.sendStatus(401); // Unauthorized if token is expired
        }

        const user = await User.findById(decoded.sub);
        if (!user || user.status !== "crew_member") {
            // return res.sendStatus(401); 
            return res.redirect('/login');// Unauthorized if user is not found or not a crew member
        }

        req.user = user;
        req.sub = decoded.sub;
        next();
    } catch (err) {
        return res.sendStatus(401); // Unauthorized if any error occurs
    }
}

module.exports = requireMemberAuth;
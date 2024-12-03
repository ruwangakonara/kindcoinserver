// requireMemberAuth.js
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// 2. Update requireMemberAuth.js
// requireMemberAuth.js
async function requireMemberAuth(req, res, next) {
    try {
        const token = req.cookies.Authorization;
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ 
                authenticated: false,
                redirectUrl: '/login/login',
                message: 'No token found'
            });
        }

        const decoded = jwt.verify(token, process.env["SECRET"]);
        
        if (Date.now() > decoded.exp) {
            return res.status(401).json({ 
                authenticated: false,
                redirectUrl: '/login/login',
                message: 'Token expired'
            });
        }

        const user = await User.findById(decoded.sub);
        console.log("Found user:", user);

        if (!user || user.status !== "crew_member") {
            return res.status(403).json({ 
                authenticated: false,
                redirectUrl: '/login/login',
                message: 'Not authorized as crew member'
            });
        }

        // Important: Set user and continue
        req.user = user;
        req.sub = decoded.sub;
        next(); // Call next() instead of returning JSON
        
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ 
            authenticated: false,
            redirectUrl: '/login/login',
            message: err.message
        });
    }
}
module.exports = requireMemberAuth;
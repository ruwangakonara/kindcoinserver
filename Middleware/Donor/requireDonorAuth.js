const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const constants = require("node:constants");

async function requireDonorAuth(req, res, next) {
   
    try{
        
        const token = req.cookies.Authorization;
        console.log(token)

        const decoded = jwt.verify(token, process.env["SECRET"])

        if(Date.now() > decoded.exp) res.sendStatus(401)

        const user = await User.findById(decoded.sub)
        if(!user || (user.status !== "donor")) return res.sendStatus(401)

        req.user = user;
        req.sub = decoded.sub;


        next()
        
    } catch (err) {
        return res.sendStatus(401)
    }
   
}

module.exports = requireDonorAuth
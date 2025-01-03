const jwt = require("jsonwebtoken");
const User = require("../models/user");
const constants = require("node:constants");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.Authorization;
    console.log(token);

    const decoded = jwt.verify(token, process.env["SECRET"]);
    console.log("Decoded toke: ",decoded);

    if (Date.now() > decoded.exp) res.sendStatus(401);

    const user = await User.findById(decoded.sub);
    // logic to not to give the auth if the user.isEthical field is false
    if (!user.isEthical) return res.sendStatus(401);

    if (!user) return res.sendStatus(401);

    req.user = user;

    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = requireAuth;

const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const constants = require("node:constants");

async function requireAdminAuth(req, res, next) {
  try {
    console.log("require Admin Auth in");
    const token = req.cookies.Authorization;
    // console.log(token);

    const decoded = jwt.verify(token, process.env["SECRET"]);

    console.log(decoded);
    if (Date.now() > decoded.exp) res.sendStatus(401);

    const user = await User.findById(decoded.sub);
    console.log(user.status);
    if (!user || user.status !== "admin") return res.sendStatus(401);

    req.user = user;
    req.sub = decoded.sub;
    console.log("require Admin Auth out");
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = requireAdminAuth;

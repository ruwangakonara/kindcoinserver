const Request = require("../../models/Request");

const getAllRequests = async (req, res) => {
  try {
    const requests = Request.find(req.body);
    res.status(200).json({ requests: requests });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllRequests };

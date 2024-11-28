// handle the logic tickets

const Ticket = require("../../models/ticket");

// logic to get all the tickets

async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { getAllTickets };

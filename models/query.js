const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    default: false,
  },
  email: {
    type: String,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Query = mongoose.model("Query", querySchema);
module.exports = Query;

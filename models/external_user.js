const mongoose = require("mongoose");

const externalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },

  token_amount: {
    type: Number,
    required: true,
  },

  xlmAmount: {
    type: Number,
    required: true,
  },
  LKRamount: {
    type: Number,
    required: true,
  },

  xlmToLkrRate: {
    type: Number,
    required: true,
  },
  tokenToXlmRate: {
    type: Number,
    required: true,
  },
});

const External_User = mongoose.model("ExternalUser", externalSchema);
module.exports = External_User;

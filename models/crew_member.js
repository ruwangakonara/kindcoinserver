const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  stellarid: {
    type: String,
    required: true,
  },
  town: {
    type: String,
    required: true,
  },
  //   images: {
  //     type: [String],
  //     default: [],
  //   },
  profile_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  certificate_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  email: {
    type: String,
    required: true,
  },

  phoneNo: {
    type: String,
    required: true,
  },
  noOfOperations: {
    type: Number,
    required: true,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const CrewMember = mongoose.model("CrewMember", crewSchema);

module.exports = CrewMember;

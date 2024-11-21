const mongoose = require("mongoose");
const { Schema } = mongoose; // This line is missing

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
  noOfOperations: {
    type: Number,
    required: true,
    default: 0,
  },
  stellarid: {
    type: String,
    required: true,
  },
  town: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  certificate_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  phoneNo: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const CrewMember = mongoose.model("CrewMember", crewSchema);

module.exports = CrewMember;

/**
 * TESTED EXAMPLE
 *
 {
  "name":"Andrew NG",
  "noOfOperations":1,
  "stellarid":"stellar@1211432idufo",
  "town":"Polonnaruwa",
  "phoneNo":"0718993252",
  "username":"crewmem@kindcoin.net",
  "password":"crewMem@123",
  "status":"crewmember"
}
 */

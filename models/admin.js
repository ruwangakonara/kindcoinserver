const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
  profile_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  // type: {
  //   type: String,
  //   // enum: ['organization', 'individual'],
  //   required: true,
  // },
  date_of_birth: {
    type: Date,
    // required: true
  },

  // stellar_address: {
  //   type: String,
  // },

  // district: {
  //   type: String,
  // },
  phoneNo: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

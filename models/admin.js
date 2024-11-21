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
  // email: {
  //   type: String,
  //   required: true,
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

/**
 * 
 * SAVED ADMIN
{
  "name":"Chamal",
  "username":"chamalferdy@gmail.com",
  "phoneNo":"0741519337",
  "password":"ferdy@123",
  "status":"admin"
}
 */

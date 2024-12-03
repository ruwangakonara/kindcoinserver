const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSequence = require("mongoose-sequence")(mongoose);

const donorSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email_verified: {
    type: Boolean,
    default: false,
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
  address: {
    type: String,
    // required: true
  },
  images: {
    type: [String],
    default: [],
  },
  profile_image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  description: {
    type: String,
    default: "",
    // required: true
  },
  type: {
    type: String,
    // enum: ['organization', 'individual'],
    required: true,
  },
  date_of_birth: {
    type: Date,
    // required: true
  },

  stellar_address: {
    type: String,
    default: "",
  },

  district: {
    type: String,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  usual_donations: {
    type: [String],
  },
  donated: {
    type: Number,
    default: 0,
  },
  tokens: {
    type: Number,
    default: 0,
  },

  anonymous: {
    type: Boolean,
    default: true,
  },

  leaderboard_anonymous: {
    type: Boolean,
    default: false,
  },

  anonymous_id: {
    type: Number,
    // required: true
  },
  // updated_at: {
  //     type: Date,
  //     default: Date.now
  // }

  image1: {
    type: String,
    default: "https://via.placeholder.com/300",
    required: true,
  },

  image2: {
    type: String,
    default: "https://via.placeholder.com/300",
    required: true,
  },

  image3: {
    type: String,
    default: "https://via.placeholder.com/300",
    required: true,
  },
  image4: {
    type: String,
    default: "https://via.placeholder.com/300",
  },
  image5: {
    type: String,
    default: "https://via.placeholder.com/300",
  },

  no_donations: {
    type: Number,
    default: 0,
  },
});

donorSchema.plugin(mongooseSequence, {
  inc_field: "anonymous_id",
  start_seq: 5,
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;

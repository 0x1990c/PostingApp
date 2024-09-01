const mongoose = require("mongoose");

// Define the Note model Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password:String,
    phoneNumber: String,
    image_url:String,
    city_live:String,
    interestedCity:String
    // country: String,
    // password: String,
    // loginBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

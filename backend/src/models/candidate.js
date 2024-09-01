const mongoose = require("mongoose");

// Define the Candidate model Schema
const candidateSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phoneNumber: String,
    city_living_in: String,
    city_interested_to_works_in: String,
    profileImage: String,
    verification_with_id: String,
    experience: {
      commitment_rating: String,
      project_fulfilled: String,
      choosen: String,
      project_terminated: String,
      left_after_selection: String,
      biggest_investment: String,
      biggest_project: String
    },
    projectIds: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("candidate", candidateSchema);
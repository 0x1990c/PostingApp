const mongoose = require("mongoose");

// Define the Note model Schema
const postProjectSchema = new mongoose.Schema(
  {
    phoneNumber: String,
    projectName: String,
    projectType: String,
    description : String,
    plan_for_success:String,
    budget : Number,
    ownership_for_every_seat:String,
    available : Number,
    investment_required_for_one_seat:String,
    location : String,
    project_image_url: String,
    audio_file:String,
    bucket:Boolean,
    project_candidates : [String],
    selected_candidates:[String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("postProject", postProjectSchema);
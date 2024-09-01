const axios = require("axios");
const qs = require("qs");
const stripe = require("stripe")(process.env.SECRET_KEY);

const candidateModel = require('../models/candidate');

const candidateController = {
    
    postCandidate: async (req, res) => {
      try {
          const { name, email, phoneNumber, city_living_in, city_interested_to_works_in } = req.body;
          const imageFile = req.file;

          // Check if the image file was uploaded
          if (!imageFile) {
              return res.status(400).json({ message: 'No image file uploaded' });
          }
          console.log(req.body);
          // Create a new candidate instance
          const newCandidate = new candidateModel({
              name,
              email,
              phoneNumber,
              city_living_in,
              city_interested_to_works_in,
              profileImage: imageFile.path,
              experience:{
                commitment_rating:'0',
                project_fulfilled:'0',
                choosen:'0',
                project_terminated:'0',
                left_after_selection:'0',
                biggest_investment:'0',
                biggest_project:'0'
              }
          });

          // Save the candidate to the database
          await newCandidate.save();

          return res.status(201).json({
              message: 'Candidate saved successfully',
              candidate: newCandidate
          });
      } catch (error) {
          console.error(error);
          return res.status(500).json({
              message: 'An error occurred while saving the candidate',
              error: error.message
          });
      }

    },
    // delete post-project
    deleteCandidate :  async (req, res) => {
        const candidateID  = req.params.id.toString().trim();
        await candidateModel.findByIdAndDelete(candidateID);
        res.json({
          message: "Candidate deleted successfully",
        });
    },

    getCandidates: async (req, res) => {
                
        const candidates_phoneNumbers = req.query.send_data;
        const candidates = await candidateModel.find({phoneNumber:{$in:candidates_phoneNumbers}});
        console.log(candidates);
        res.json({
          data:candidates,
          message: "All Candidates",
        });
    },

    update: async (req, res) => {
        const candidateID  = req.params.id.toString().trim();
        candidateModel.findOneAndUpdate({ _id: candidateID }, req.body, { new: true }).then(
          (data) => {
            res.json({
              data,
              message: "Candidate updated successfully",
            });
          }
        );
    },

};

module.exports = candidateController;
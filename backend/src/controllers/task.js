const axios = require("axios");
const qs = require("qs");
const stripe = require("stripe")(process.env.SECRET_KEY);

const postProjectModel = require('../models/postProject');
const candidateModel = require('../models/candidate');



// const upload = multer({storage:multer.memoryStorage()});


const taskController = {
    // post project add
    postProject: async (req, res) => {
    try{
            const {phoneNumber, projectName,projectType, description, plan_for_success, budget, ownership_for_every_seat, available,
              investment_required_for_one_seat, location  } = req.body;
            const imageFile = req.file;
            if(!imageFile){
              return res.status(404).json({message:'No image file uploaded'});
            }
            const save_data = new postProjectModel({
              phoneNumber,
              projectName,
              projectType,
              description,
              plan_for_success,
              budget,
              ownership_for_every_seat,
              available,
              investment_required_for_one_seat,
              location,
              project_image_url:imageFile.path,
              // audio_file:req.files.audioFile ? req.files.audioFile[0].path : null,
              bucket:false
            }); 
            await save_data.save();

            res.status(201).json({ message: 'Post project created successfully' });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // delete post-project
    deletePostProject :  async (req, res) => {
        const postID  = req.params.id.toString().trim();
        await postProjectModel.findByIdAndDelete(postID);
        res.json({
          message: "PostProject deleted successfully",
        });
    },

    getProjects: async (req, res) => {
        
        try{
            const postprojects = await postProjectModel.find();
            
            res.json({
                data: postprojects,
                message: "All Post Projects",
            });
        }catch(error){
            res.status(500).json(
              {
                message:'An error occurred while fetching post projects',
                error:error.message
              }
            )
        }
        
    },

    update: async (req, res) => {
        const postID  = req.params.id.toString().trim();
        postProjectModel.findOneAndUpdate({ _id: postID }, req.body, { new: true }).then(
          (data) => {
            res.json({
              data,
              message: "Post Project updated successfully",
            });
          }
        );
    },

    filterProject:async(req,res) => {
      try{

        const buttonNames =  req.query.buttonNames;
        const projectTypes = Array.isArray(buttonNames) ? buttonNames : [buttonNames];
        const project_lists = await postProjectModel.find({projectType:{ $in:projectTypes}});
        // console.log(project_lists);
        res.json(
          project_lists
        );

      }catch(error){
        res.status(500).json(
          {
            message:'An error occurred while fetching flitering projects',
            error:error.message
          }
        )
      }
    },

    applyProject: async(req,res) => {
      console.log(req.body);
      const project = req.body.project;
      const phoneNumber = req.body.phoneNumber;
      const confirm_candidate = await candidateModel.find({phoneNumber:req.body.phoneNumber});
      if(confirm_candidate.length == 0){
          return res.json({
            message:'no candidate'
          });
      }else{
          try{
            const updatedProject = await postProjectModel.findByIdAndUpdate(
              project,
              {$addToSet:{project_candidates:phoneNumber}},
              {new:true}
            );
          }catch(error){
            console.error(error);
            return res.status(500).json({message:'An error occured while updating the project'});
          }
          return res.json({
            message:'successful'
          });
      }
      
    },

    selectCandidate: async(req, res) => {
      const req_data = req.body.send_data;
      const project_id = req_data.project_id;
      const phoneNumber = req_data.candidate_phoneNumber;
      try{
                
        const updatedProject = await postProjectModel.findByIdAndUpdate(
          project_id,
          { $addToSet: { selected_candidates: phoneNumber } }, // Add phoneNumber to selected_candidates
          { new: true } // Return the updated document
        );
        return res.json({
          message:'successful'
        })

      }catch(error){
        console.error(error);
        return res.status(500).json({message:'An error occured while updating the project'});
      }
      
    }

};

module.exports = taskController ;

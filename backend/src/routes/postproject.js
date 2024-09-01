const { Router } = require("express");
const taskController = require("../controllers/task");
const router = Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
      const dir = './src/uploads';
      if(!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename:(req, file, cb) => {
        
      cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({storage:storage});

router.post("/post_project" ,upload.single('image'), taskController.postProject);
// router.post("/post_project" ,upload.fields([{ name: 'image' }, { name: 'audioFile' }]), taskController.postProject);
router.delete("/delete_postproject/:id", taskController.deletePostProject);
router.get("/get_projects", taskController.getProjects);
router.patch("/update/:id", taskController.update);
router.get("/filter_project", taskController.filterProject);
router.post("/apply_project", taskController.applyProject);
router.post("/select_candidate", taskController.selectCandidate);

module.exports = router;
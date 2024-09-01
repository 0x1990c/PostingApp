const { Router } = require("express");
const candidateController = require("../controllers/candidate");
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
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

router.post("/post_candidate", upload.single('image'), candidateController.postCandidate);
router.delete("/delete_candidate/:id", candidateController.deleteCandidate);
router.get("/get_candidates", candidateController.getCandidates);
router.patch("/update/:id", candidateController.update);

module.exports = router;
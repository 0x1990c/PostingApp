const { Router } = require("express");

const userController = require("../controllers/user");

const router = Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/check_user", userController.checkUser);

router.patch("/update/:_id", userController.update);
router.get("/all_types", userController.allTypes);
router.post("/register", userController.register);


module.exports = router;

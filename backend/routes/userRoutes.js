const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", auth, userController.getProfile);

module.exports = router;

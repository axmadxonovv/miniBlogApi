let express = require("express");
let router = express.Router();
let authController = require("../controllers/auth.controller");
const protect = require("../midllewares/protect");

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.login);
// router.route("/refresh").post(authController.resetAccesTojenWithRefresh);
// router.get("/profile", protect, authController.getProfile);

module.exports = router;

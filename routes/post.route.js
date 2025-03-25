let express = require("express");
let router = express.Router();
const protect = require("../midllewares/protect");
const ownerMiddleware = require("../midllewares/ownerMiddleware");
const {
  addPost,
  getAllPost,
  updatePost,
  deletePost,
  getPost,
} = require("../controllers/post.controller");
router.route("/").post(protect, addPost).get(protect, getAllPost);
router
  .route("/:id")
  .put(protect, ownerMiddleware, updatePost)
  .delete(protect, ownerMiddleware, deletePost)
  .get(protect, getPost);

module.exports = router;

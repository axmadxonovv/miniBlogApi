let express = require("express");
let router = express.Router();
let path = require("path");
const protect = require("../midllewares/protect");
const ownerMiddleware = require("../midllewares/ownerMiddleware");
let multer = require("multer");
let storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "--" +
        Math.floor(Math.random * 1000) +
        "--" +
        "post" +
        path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: storage,
  limit: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    let extraname = path.extname(file.originalname);
    if (extraname == ".png") cb(null, true);
    else cb(null, false);
  },
});
const {
  addPost,
  getAllPost,
  updatePost,
  deletePost,
  getPost,
} = require("../controllers/post.controller");
router
  .route("/")
  .post(protect, upload.single("photo"), addPost)
  .get(protect, getAllPost);
router
  .route("/:id")
  .put(protect, ownerMiddleware, updatePost)
  .delete(protect, ownerMiddleware, deletePost)
  .get(protect, getPost);

module.exports = router;

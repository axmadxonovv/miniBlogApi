const PostModel = require("../models/post.model");
const errorHandler = require("../utils/error.handler");
const sendResponse = require("../utils/respons");

let getPost = errorHandler(async (req, res, next) => {
  id = req.params.id;
  let Post = await PostModel.findById(id).populate(
    "author",
    "username email active"
  );
  sendResponse(res, 200, Post);
});
let addPost = errorHandler(async (req, res, next) => {
  let data = req.body;
  data.photo = req.file.path;
  let Post = await PostModel.create(data);
  sendResponse(res, 201, Post);
});
let updatePost = errorHandler(async (req, res, next) => {
  let id = req.params.id;
  let data = req.body;
  let book = await PostModel.findByIdAndUpdate(id, data, { new: true });
  sendResponse(res, 203, book);
});

let deletePost = errorHandler(async (req, res, next) => {
  let id = req.params.id;
  await PostModel.findByIdAndDelete(id);
  res.status(204).send({ Post: "dsds" });
});
let getById = errorHandler(async (req, res, next) => {
  let Post = await PostModel.findById(req.params.id).populate(
    "author",
    "username email active"
  );
  if (!Post) throw new Error("Tour topilmadi ");
  res.status(200).send({ Tour });
});
let getAllPost = errorHandler(async (req, res, next) => {
  let Post = await PostModel.find().populate("author", "username email active");
  sendResponse(res, 200, Post);
});

module.exports = {
  getPost,
  addPost,
  deletePost,
  getById,
  getAllPost,
  updatePost,
};

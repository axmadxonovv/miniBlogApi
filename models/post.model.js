const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  photo: { type: String },
  active: { type: Boolean, default: true },
});
module.exports = mongoose.model("Post", postSchema);

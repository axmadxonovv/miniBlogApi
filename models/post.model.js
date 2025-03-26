const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photo: { type: String },
  active: { type: Boolean, default: true },
});
module.exports = mongoose.model("Post", postSchema);

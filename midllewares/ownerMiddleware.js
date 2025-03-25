let PostModel = require("../models/post.model");
let sendResponse = require("../utils/respons");

let ownerMiddleware = async (req, res, next) => {
  try {
    data = req.user;
    id = req.user.id;
    if (!req.params.id) throw new Error("id bermadingiz ");
    let post = await PostModel.findById(req.params.id);
    if (post.author !== id) throw new Error("sizga ruxsat yoq");
    next();
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};

module.exports = ownerMiddleware;

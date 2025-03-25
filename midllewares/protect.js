let jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error.handler");
const User = require("../models/user.model");
let protect = errorHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    throw new Error("Siz token xato beryapsiz");
  let token = req.headers.authorization.split(" ")[1];
  if (!token) throw new Error("Token olinmadi");
  let checking = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
  let user = await User.findById(checking.id).select("active role username");

  if (!user || !user.active) {
    throw new Error("Siz tizim mavjud emassiz ");
  }
  req.user = user;

  next();
});

module.exports = protect;

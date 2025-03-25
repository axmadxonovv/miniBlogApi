const User = require("../models/user.model");
const errorHandler = require("../utils/error.handler");
const sendResponse = require("../utils/respons");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

let registerUser = errorHandler(async (req, res, next) => {
  let { email, username, password } = req.body;
  if (!email || !username || !password) {
    throw new Error("Ma'lumotlar to'liq emas");
  }
  let [existUser, existUserEmail] = await Promise.all([
    User.find({ username: username }),
    User.find({ email: email }),
  ]);
  if (existUser.length || existUserEmail.length) {
    throw new Error(
      `boshqa ${existUser.length ? "username" : "email"} qo'ying`
    );
  }

  let user = await User.create({ email, username, password });
  sendResponse(res, 200, {
    message: "Siz muvaffaqiyat ro'yxatdan o'tdingiz",
    user,
  });
});

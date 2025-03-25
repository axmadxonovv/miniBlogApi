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
    User.find({ username }),
    User.find({ email }),
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

let login = errorHandler(async (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !password)
    throw new Error("username yoki password berilmagan");
  let user = await User.findOne({ username })
    .select("password username email name role")
    .exec();
  if (!user) throw new Error("Siz oldin ro'yxat o'tmagansiz ");

  console.log(req.body);

  let checking = await bcrypt.compare(password, user.password);
  if (!checking) throw new Error("password xato kiritilgan berilmagan");
  console.log(user.password, checking);
  user.password = password;
  let token = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_EXP_TIME }
  );

  console.log(eval(process.env.JWT_REFRESH_EXP_TIME));

  let refreshToken = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: eval(process.env.JWT_REFRESH_EXP_TIME) }
  );
  user.refreshToken = refreshToken;
  await user.save();

  let options = {
    maxAge: eval(process.env.JWT_REFRESH_EXP_TIME),
    httpOnly: false,
  };

  res.cookie("jwt", refreshToken, options);
  let userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  sendResponse(res, 200, { userObj, token });
});

module.exports = { registerUser, login };

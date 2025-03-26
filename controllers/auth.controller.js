const User = require("../models/user.model");
// const errorHandler = require("../utils/error.handler");
const sendResponse = require("../utils/respons");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

let registerUser = async (req, res, next) => {
  try {
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
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};

let login = async (req, res, next) => {
  try {
    let { username, password } = req.body;
    if (!username || !password)
      throw new Error("username yoki password berilmagan");
    let user = await User.findOne({ username })
      .select("password username email name role")
      .exec();
    if (!user) throw new Error("Siz oldin ro'yxat o'tmagansiz ");

    let checking = await bcrypt.compare(password, user.password);
    if (!checking) throw new Error("password xato kiritilgan berilmagan");
    user.password = password;
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

    sendResponse(res, 200, { userObj });
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};
let generateAccesToken = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    let checking = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);

    let user = await User.findOne({ refreshToken: token });
    if (!user || user.id !== checking.id) {
      throw new Error("bunday user mavjud emas");
    }

    let accesToken = await jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_EXP_TIME }
    );

    sendResponse(res, 200, { token: accesToken });
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};
let getProfile = async (req, res, next) => {
  try {
    let user = req.user;

    user = await User.findOne({ _id: user.id });

    res.status(200).json({ user });
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};

let logOut = async (req, res, next) => {
  try {
    let options = {
      maxAge: eval(process.env.JWT_REFRESH_EXP_TIME),
      httpOnly: false,
    };
    res.clearCookie("jwt", options);
    sendResponse(res, 200, "loged out");
  } catch (error) {
    sendResponse(res, 401, error.message);
  }
};

module.exports = {
  registerUser,
  login,
  generateAccesToken,
  getProfile,
  logOut,
};

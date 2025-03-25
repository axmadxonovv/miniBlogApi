require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose
      .connect(
        process.env.DATABASE.replace("<db_password>", process.env.PASSWORD)
      )
      .then(() => {
        console.log("db connected");
      });
  } catch (error) {
    console.log("mongoo error----", error);
  }
};
module.exports = connectDb;

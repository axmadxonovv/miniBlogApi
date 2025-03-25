const express = require("express");
const app = express();
let errController = require("./controllers/error.controller");
const mongana = require("morgan");
let authRouter = require("./routes/auth.route");
const connectDb = require("./config/db");
const env = require("dotenv").config();
let cookieParser = require("cookie-parser");
connectDb();
app.use(cookieParser());
app.use(express.json());
app.use(mongana("dev"));
app.use(express.urlencoded({ extends: true }));
app.use(errController);
app.use("/auth", authRouter);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥");
  console.log(err.name, err.message);
  // process.exit(1);
});

// Unhandled Excpections
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Excpections 💥");
  console.log(err.name, err.message);
  // process.exit(1);
});

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

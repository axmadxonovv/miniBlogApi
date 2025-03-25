const express = require("express");
const app = express();
const mongana = require("morgan");
const connectDb = require("./config/db");
const env = require("dotenv").config();
connectDb();
app.use(express.json());
app.use(mongana("dev"));
app.use(express.urlencoded({ extends: true }));

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

const errorHandler = require("../utils/error.handler").default;

let errController = (error, req, res, next) => {
  res.status(404).json({ status: "Failed", message: error.message });
};

module.exports = errController;

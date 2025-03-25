const resposcha = require("./resposcha.js");

let errorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      console.log(err, "errorcha");
      resposcha(res, 404, "Xatolik: " + err.message);
    });
  };
};

module.exports = errorHandler;

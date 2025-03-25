const resposcha = require("../utils/resposcha");

let checkRole = function async(roles) {
  return function (req, res, next) {
    try {
      let user = req.user;
      console.log(user, "c-eck");
      if (roles.includes(req.user.role)) next();
      else throw new Error("Siz admin emassiz");
    } catch (error) {
      resposcha(res, 404, error.message);
    }
  };
};

module.exports = checkRole;

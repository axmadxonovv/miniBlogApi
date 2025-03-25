const ToursModel = require("../models/tour.model");
const errorHandler = require("../utils/error.handler");
const resposcha = require("../utils/resposcha");

let getTours = errorHandler(async (req, res, next) => {
  let Tours = await ToursModel.find().populate({
    path: "guides",
    select: "name",
  });

  resposcha(res, 200, Tours);
});
let addTour = errorHandler(async (req, res, next) => {
  console.log(req.user);

  let Tour = await ToursModel.create({
    ...req.body,
    guides: [req.user.id, ...req.body.guides],
  });
  resposcha(res, 201, Tour);
});

let deleteTour = errorHandler(async (req, res, next) => {
  res.status(204).send({ Tours: "dsds" });
});
let getById = errorHandler(async (req, res, next) => {
  let Tour = await ToursModel.findById(req.params.id).populate("comments");
  if (!Tour) throw new Error("Tour topilmadi ");
  console.log(req.params.id, "iddddd");
  res.status(200).send({ Tour });
});

module.exports = { getTours, addTour, deleteTour, getById };

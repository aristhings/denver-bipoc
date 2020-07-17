const express = require("express");
const api = express.Router();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const dbAccepted = new FileSync("./databases/accepted.json");
const dbRejected = new FileSync("./databases/rejected.json");
const dbReview = new FileSync("./databases/review.json");

const accepted = low(dbAccepted);
const rejected = low(dbRejected);
const review = low(dbReview);

var acceptedQueryParams = ["id", "name", "address", "phone", "type", "website"];
var acceptedQueryCategories = [
  "food",
  "retail",
  "health",
  "fitness",
  "beauty",
  "creative",
  "orgs",
  "misc",
];

api.get("/api/businesses/all", function (req, res) {
  res.json(accepted.getState());
});

api.get("/api/businesses/:category", function (req, res) {
  var response = accepted.get(req.params.category).value();
  res.status(200).json(response);
});

api.get("/api/business/", function (req, res) {
  var fail = false;
  var query = {};
  var error = {};

  for (const key in req.query) {
    if (acceptedQueryParams.includes(key)) {
      query[key] = req.query[key];
    } else if (!acceptedQueryParams.includes(key)) {
      error[
        key
      ] = `The key \"${key}\" isn't valid, meaning your query value \"${req.query[key]}\" can't be used. \n`;
    } else fail = true;
  }

  function response() {
    if (fail == true) {
      res
        .status(500)
        .send(
          "An unknown error has occured. Please contact arimgibson@gmail.com with your query information."
        );
    } else if (Object.keys(error).length !== 0) {
      res
        .status(400)
        .send(
          `The following errors have occured: \n ` +
            Object.values(error).join("")
        );
    } else if (Object.keys(query).length !== 0) {
      res.status(200).json(query);
    } else {
      res
        .status(500)
        .send(
          "An unknown error has occured. Please contact arimgibson@gmail.com with your query information."
        );
    }
  }

  response();
});

module.exports = api;

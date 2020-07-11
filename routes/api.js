const express = require("express");
const api = express.Router();
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const dbAccepted = new FileSync("./databases/accepted.json");
const dbRejected = new FileSync("./databases/rejected.json");
const dbReview = new FileSync("./databases/review.json");

const accepted = low(dbAccepted);
const rejected = low(dbRejected);
const review = low(dbReview);

api.get("/api/get-businesses", function (req, res) {
  res.json(accepted.getState("docs"));
});

api.get("/api/business/:id", function (req, res) {
  var val = accepted.get("docs").find({ id: req.params.id }).value();
  res.json(val);
});

module.exports = api;

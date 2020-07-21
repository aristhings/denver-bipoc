const express = require("express");
const mongo = require("../databaseRelated/initMongoDB.js").getDB();
const api = express.Router();

const accepted = mongo.collection("accepted");
const rejected = mongo.collection("rejected");
const review = mongo.collection("review");

var acceptedQueryParams = ["id", "name", "address", "phone", "type", "website"];

api.get("/api/businesses/all", function (req, res) {
  accepted
    .find()
    .toArray()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(500)
        .send(
          `An error has occured. If it looks like this error is on our side, please contact arimgibson@gmail.com with the error details so they can look into it. \n ${err}`
        )
    );
});

api.get("/api/businesses/types/:type", function (req, res) {
  accepted
    .find({ types: [req.params.type] })
    .toArray()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(500)
        .send(
          `An error has occured. If it looks like this error is on our side, please contact arimgibson@gmail.com with the error details so they can look into it. \n ${err}`
        )
    );
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

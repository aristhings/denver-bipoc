const express = require("express");
const mongo = require("../databaseRelated/initMongoDB.js").getDB();
const api = express.Router();

const accepted = mongo.collection("accepted");
const rejected = mongo.collection("rejected");
const review = mongo.collection("review");

var acceptedQueryParams = [
  "id",
  "name",
  "address",
  "phone",
  "types",
  "website",
];

api.get("/api/business/all", function (req, res) {
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

api.get("/api/business/exact", function (req, res) {
  var fail = false;
  var query = {};
  var error = {};

  if (req.body !== undefined) bodyData();
  if (req.query !== undefined) urlData();
  else res.status(400).send("No query data provided");

  function addKey(key, dataSource) {
    if (dataSource == "body") {
      if (key == "id") query["_id"] = req.body[key];
      else query[key] = req.body[key];
    }
    if (dataSource == "url") {
      if (key == "id") query["_id"] = req.query[key];
      else query[key] = req.query[key];
    }
  }

  function bodyData() {
    for (const key in req.body) {
      if (acceptedQueryParams.includes(key)) {
        addKey(key);
      } else if (!acceptedQueryParams.includes(key)) {
        error[
          key
        ] = `The key \"${key}\" isn't valid, meaning your query value \"${req.query[key]}\" can't be used. \n`;
      } else fail = true;
    }
    response();
  }

  function urlData() {
    for (const key in req.query) {
      if (acceptedQueryParams.includes(key)) {
        addKey(key);
      } else if (!acceptedQueryParams.includes(key)) {
        error[
          key
        ] = `The key \"${key}\" isn't valid, meaning your query value \"${req.query[key]}\" can't be used. \n`;
      } else fail = true;
    }
    response();
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
      accepted
        .find(query)
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((err) =>
          res
            .status(500)
            .send(
              `An error has occured. If it looks like this error is on our side, please contact arimgibson@gmail.com with the error details so they can look into it. \n ${err}`
            )
        );
    } else {
      res
        .status(500)
        .send(
          "An unknown error has occured. Please contact arimgibson@gmail.com with your query information."
        );
    }
  }
});

module.exports = api;

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
  "searchType",
  "searchOp",
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

api.get("/api/business", function (req, res) {
  var searchType, searchOp;

  var queryKeys = {};
  var error = {};

  if (Object.keys(req.body).length !== 0) bodyData();
  else if (Object.keys(req.query).length !== 0) urlData();
  else res.status(400).send("No query data provided.");

  function bodyData() {
    if (req.body.searchType === "exact") searchType = "exact";
    else if (req.body.searchType === "strict") searchType = "strict";
    else searchType = "standard";

    if (req.body.searchOp === "or") searchOp = "or";
    else searchOp = "and";

    if (req.body.id !== undefined) {
      accepted
        .find({ _id: req.body.id })
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((err) => sendError(err));
    } else {
      for (const key in req.body) {
        if (acceptedQueryParams.includes(key)) {
          if (key !== "searchOp" || "searchType")
            queryKeys[key] = req.body[key];
        } else if (!acceptedQueryParams.includes(key)) {
          error[
            key
          ] = `The key \"${key}\" isn't valid, meaning your query value \"${req.body[key]}\" can't be used. \n`;
        } else sendError("unknown");
      }
      errorChecker();
    }
  }

  function urlData() {
    if (req.query.searchType == "exact") searchType = "exact";
    else if (req.query.searchType == "strict") searchType = "strict";
    else searchType = "standard";

    if (req.query.searchOp === "or") searchOp = "or";
    else searchOp = "and";

    if (req.query.id !== undefined) {
      accepted
        .find({ _id: req.query.id })
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((err) => sendError(err));
    } else {
      delete req.query["searchOp"];
      delete req.query["searchType"];
      for (const key in req.query) {
        if (acceptedQueryParams.includes(key)) {
          queryKeys[key] = req.query[key];
        } else if (!acceptedQueryParams.includes(key)) {
          error[
            key
          ] = `The key \"${key}\" isn't valid, meaning your query value \"${req.query[key]}\" can't be used. \n`;
        } else sendError("unknown");
      }
      errorChecker();
    }
  }

  function errorChecker() {
    if (Object.keys(error).length !== 0) {
      res
        .status(400)
        .send(
          `The following errors have occured: \n ` +
            Object.values(error).join("")
        );
    } else search();
  }

  function search() {
    var queryArray;
    if (searchType == "exact")
      queryArray = Object.entries(queryKeys).map(([k, v]) => ({
        [`"${k}"`]: new RegExp(v, "is"),
      }));
    else if (searchType == "strict")
      queryArray = Object.entries(queryKeys).map(([k, v]) => ({
        [k]: new RegExp(".*" + v + ".*", "i"),
      }));
    else if (searchType == "standard") {
      var name = { $text: { $search: queryKeys[name] } };
      delete queryKeys[name];
      partialArray = Object.entries(queryKeys).map(([k, v]) => ({
        [`"${k}"`]: new RegExp(`.*${v}.*`, "is"),
      }));
      partialArray.unshift(name);
      queryArray = partialArray;
    } else sendError("unknown");

    if (searchOp === "and") {
      accepted
        .find({ $and: queryArray })
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((err) => sendError(err));
      console.log(JSON.stringify(queryArray));
    } else if (searchOp === "or") {
      accepted
        .find({ $or: queryArray })
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((err) => sendError(err));
      console.log(queryArray);
    } else sendError("unknown");
  }

  function sendError(errorMsg) {
    if (errorMsg === "unknown") {
      res
        .status(500)
        .send(
          `An unknown error has occured. Please contact arimgibson@gmail.com with the error details so they can look into it.`
        );
    } else {
      res
        .status(500)
        .send(
          `An error has occured. If it looks like this error is on our side, please contact arimgibson@gmail.com with the error details so they can look into it. \n ${errorMsg}`
        );
    }
  }
});

module.exports = api;

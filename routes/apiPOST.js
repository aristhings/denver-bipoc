const express = require("express");
const mongo = require("../databaseRelated/initMongoDB.js").getDB();
const api = express.Router();
const axios = require("axios");

const accepted = mongo.collection("accepted");
const rejected = mongo.collection("rejected");
const review = mongo.collection("review");

api.post("/api/business/id/:id", function (req, res) {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&fields=name,formatted_address,formatted_phone_number,types,website,url&key=AIzaSyDRjM-tDxDM3Ji0YUm-b-KUU_aPo4nmweM`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((place) => {
      review
        .insertOne({
          _id: req.params.id,
          name: place.data.result.name,
          address: place.data.result.address,
          phone: place.data.result.formatted_phone_number,
          type: place.data.result.types,
          website: place.data.result.website,
          google_url: place.data.result.url,
        })
        .write();
      res.status(200).json({
        _id: req.params.id,
        name: place.data.result.name,
        address: place.data.result.address,
        phone: place.data.result.formatted_phone_number,
        type: place.data.result.types,
        website: place.data.result.website,
        google_url: place.data.result.url,
      });
    })
    .catch((err) => console.log(err));
});

api.post("/api/business/id-pass/:pass/:id", function (req, res) {
  if (req.params.pass == process.env.PASS) {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&fields=name,formatted_address,formatted_phone_number,types,website,url&key=AIzaSyDRjM-tDxDM3Ji0YUm-b-KUU_aPo4nmweM`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((place) => {
        accepted
          .get("businesses")
          .insertOne({
            _id: req.params.id,
            name: place.data.result.name,
            address: place.data.result.address,
            phone: place.data.result.formatted_phone_number,
            type: place.data.result.types,
            website: place.data.result.website,
            google_url: place.data.result.url,
          })
          .write();
        res.status(200).json({
          _id: req.params.id,
          name: place.data.result.name,
          address: place.data.result.address,
          phone: place.data.result.formatted_phone_number,
          type: place.data.result.types,
          website: place.data.result.website,
          google_url: place.data.result.url,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.status(403).send("Invalid administrator password.");
  }
});

module.exports = api;

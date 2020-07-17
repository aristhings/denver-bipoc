const express = require("express");
const api = express.Router();
const app = express();
const https = require("https");

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
        .get("businesses")
        .push({
          place_id: req.params.id,
          name: place.data.result.name,
          address: place.data.result.address,
          phone: place.data.result.formatted_phone_number,
          type: place.data.result.types,
          website: place.data.result.website,
          google_url: place.data.result.url,
        })
        .write();
      res.status(200).json({
        place_id: req.params.id,
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
          .push({
            place_id: req.params.id,
            name: place.data.result.name,
            address: place.data.result.address,
            phone: place.data.result.formatted_phone_number,
            type: place.data.result.types,
            website: place.data.result.website,
            google_url: place.data.result.url,
          })
          .write();
        res.status(200).json({
          place_id: req.params.id,
          name: place.data.result.name,
          address: place.data.result.address,
          phone: place.data.result.formatted_phone_number,
          type: place.data.result.types,
          website: place.data.result.website,
          google_url: place.data.result.url,
        });
      })
      .catch((err) => console.log(err));
  } else {res.status(401).send("Invalid administrator password.")}
});

module.exports = api;

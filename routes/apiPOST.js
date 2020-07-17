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
  https.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&fields=name,formatted_address,formatted_phone_number,types,website,url&key=AIzaSyDRjM-tDxDM3Ji0YUm-b-KUU_aPo4nmweM`,
    (place) => {
      review.get("food").push({
        place_id: res.params.id,
        name: place.result.name,
        address: place.result.address,
        phone: place.result.formatted_phone_number,
        type: place.result.types,
        website: place.results.website,
        google_url: place.result.url,
      });

      res.status(200).json({
        place_id: res.params.id,
        name: place.result.name,
        address: place.result.address,
        phone: place.result.formatted_phone_number,
        type: place.result.types,
        website: place.results.website,
        google_url: place.result.url,
      });
    }
  );
});

module.exports = api;

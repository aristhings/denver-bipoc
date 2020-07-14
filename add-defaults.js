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

const databases = [accepted, rejected, review];

databases.forEach((db) =>
  db.defaults({
    food: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    retail: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    heath: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    fitness: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    beauty: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    creative: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    orgs: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
    misc: [
      {
        place_id: "",
        name: "",
        address: "",
        phone: "",
        type: "",
        website: "",
        google_url: "",
      },
    ],
  }).write()
);

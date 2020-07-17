// This shouldn't be used to create the databases but can serve as an example of the schema the databases should have.
// Upon writing information to the database, the empty fields added here are left in the database.

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
  db
    .defaults({
      businesses: [
        {
          place_id: "",
          name: "",
          address: "",
          phone: "",
          type: [],
          website: "",
          google_url: "",
        },
      ],
    })
    .write()
);

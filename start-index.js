const express = require("express");
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("database.json");
const db = low(adapter);

var documents = [
  {
    name: "Lunr",
    text: "Like Solr, but much smaller, and not as bright.",
  },
  {
    name: "React",
    text: "A JavaScript library for building user interfaces.",
  },
  {
    name: "Lodash",
    text:
      "A modern JavaScript utility library delivering modularity, performance & extras.",
  },
];

documents.forEach((doc) =>
  db.get("docs").push({ name: doc.name, text: doc.text }).write()
);

var query = db.getState("docs");

console.log(query);

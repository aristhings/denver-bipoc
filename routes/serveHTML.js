const express = require("express");
const app = express.Router();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/views/api.html");
});

module.exports = app;

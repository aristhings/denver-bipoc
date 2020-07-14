const express = require("express");
const app = express();
const api = require("./routes/api.js");

var port = process.env.PORT || 2002;

app.use(api);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/views/api.html");
});

var listener = app.listen(port, () => {
  console.log(`Server is now listening on port ${port}.`);
});

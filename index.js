const express = require("express");
const app = express();
const api = require("./routes/api.js");

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

app.listen(process.env.PORT || 2002, () => {
  console.log(`Server is now listening`);
});

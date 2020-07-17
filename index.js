const express = require("express");
const app = express();
const apiGET = require("./routes/apiGET.js");
const apiPOST = require("./routes/apiPOST.js");
const serveHTML = require("./routes/serveHTML.js");

var port = process.env.PORT || 2002;

app.use(serveHTML);
app.use(apiGET);
app.use(apiPOST);

app.listen(port, () => {
  console.log(`Server is now listening on port ${port}.`);
});

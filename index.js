const express = require("express");
const mongo = require("./databaseRelated/initMongoDB.js");
const app = express();

var port = process.env.PORT || 2002;

mongo.connectToServer(function (err, client) {
  if (err) console.error(err);
  else {
    const serveHTML = require("./routes/serveHTML.js");
    const apiGET = require("./routes/apiGET.js");
    const apiPOST = require("./routes/apiPOST.js");

    app.use(serveHTML);
    app.use(apiGET);
    app.use(apiPOST);

    app.listen(port, () => {
      console.log(`Server is now listening on port ${port}.`);
    });
  }
});

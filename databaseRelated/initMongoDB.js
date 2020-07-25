const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://ari:fz8aiTY%2454016mc2b%24*%26@businesses.ophxv.gcp.mongodb.net/business?retryWrites=true&w=majority";

var _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        _db = client.db("business");
        return callback(err);
      }
    );
  },

  getDB: function () {
    return _db;
  },
};

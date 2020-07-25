const MongoClient = require("mongodb").MongoClient;

var _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      process.env.mongoDB,
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

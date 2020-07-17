const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const dbAccepted = new FileSync("./databases/accepted.json");

const db = low(dbAccepted);

var yes = db.get("food").find({ random: { junk: "hallo" }}).value();

console.log(yes)

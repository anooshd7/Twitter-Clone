/* eslint-env node */
const DataStore = require("nedb");

const db = {};

db.users = new DataStore({ filename: "./database/users.db", autoload: true });
db.tweets = new DataStore({ filename: "./database/tweets.db", autoload: true });

module.exports = db;

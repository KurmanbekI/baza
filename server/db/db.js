// server/db/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "kurmanbek",
  host: "localhost",
  database: "baza",
  password: "Kurmanbek_1200",
  port: 5432,
});

module.exports = pool;
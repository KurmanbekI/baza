const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "kurmanbek",
  host: "localhost",
  database: "baza",
  password: "", // если без пароля, оставь пустым
  port: 5432,
});

module.exports = pool;
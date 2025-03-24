const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

db.connect()
  .then(() => console.log('✅ Подключение к базе данных установлено'))
  .catch((err) => console.error('❌ Ошибка подключения к базе данных:', err));

module.exports = db;
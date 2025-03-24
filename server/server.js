// server/server.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const db = require("./db/db.js");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Маршруты
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Проверка соединения с базой данных
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к базе данных', err);
  } else {
    console.log('Успешное подключение к базе данных:', res.rows[0]);
  }
});

app.listen(3001, () => {
  console.log("Сервер запущен на http://localhost:3001");
});
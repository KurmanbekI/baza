// server/routes/tasks.js
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// Получение задач по employee_id
router.get("/by-employee/:employee_id", async (req, res) => {
  const { employee_id } = req.params;

  try {
    const tasks = await db.query("SELECT * FROM tasks WHERE employee_id = $1", [employee_id]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Старт задачи
router.post("/start/:task_id", async (req, res) => {
  const { task_id } = req.params;

  try {
    await db.query("UPDATE tasks SET start_time = NOW() WHERE id = $1", [task_id]);
    res.json({ message: "Задача начата" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Стоп задачи
router.post("/stop/:task_id", async (req, res) => {
  const { task_id } = req.params;

  try {
    await db.query("UPDATE tasks SET end_time = NOW() WHERE id = $1", [task_id]);
    res.json({ message: "Задача завершена" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
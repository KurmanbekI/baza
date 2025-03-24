const express = require("express");
const router = express.Router();
const db = require("../db");

// Получить задачи по ID сотрудника
router.get("/by-employee/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE employee_id = $1 ORDER BY id DESC",
      [employeeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Старт задачи
router.post("/start", async (req, res) => {
  const { taskId } = req.body;

  try {
    await db.query(
      "UPDATE tasks SET is_running = true, is_paused = false, start_time = NOW() WHERE id = $1",
      [taskId]
    );
    res.json({ message: "Задача запущена" });
  } catch (error) {
    console.error("Ошибка при старте задачи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Пауза задачи
router.post("/pause", async (req, res) => {
  const { taskId } = req.body;

  try {
    await db.query(
      "UPDATE tasks SET is_running = false, is_paused = true WHERE id = $1",
      [taskId]
    );
    res.json({ message: "Задача поставлена на паузу" });
  } catch (error) {
    console.error("Ошибка при паузе задачи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Стоп задачи
router.post("/stop", async (req, res) => {
  const { taskId } = req.body;

  try {
    await db.query(
      "UPDATE tasks SET is_running = false, is_paused = false, end_time = NOW() WHERE id = $1",
      [taskId]
    );
    res.json({ message: "Задача завершена" });
  } catch (error) {
    console.error("Ошибка при завершении задачи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
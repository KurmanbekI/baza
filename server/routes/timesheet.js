const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// Добавление табеля (POST)s
router.post("/add", async (req, res) => {
  const { date, timesheet } = req.body;

  try {
    for (let employee_id in timesheet) {
      const { start, end } = timesheet[employee_id];
      await db.query(
        "INSERT INTO timesheet (employee_id, date, start_time, end_time) VALUES ($1, $2, $3, $4)",
        [employee_id, date, start, end]
      );
    }
    res.json({ success: true, message: "Табель успешно добавлен" });
  } catch (error) {
    console.error("Ошибка при добавлении табеля:", error);
    res.status(500).json({ success: false, message: "Ошибка при добавлении табеля" });
  }
});

// Табель за конкретный день (GET)
router.get("/day", async (req, res) => {
  const { date } = req.query;

  try {
    const result = await db.query(
      `SELECT e.name, t.start_time, t.end_time, COALESCE(array_agg(ts.title), '{}') AS tasks
       FROM timesheet t
       JOIN employees e ON e.id = t.employee_id
       LEFT JOIN tasks ts ON ts.employee_id = e.id AND ts.date = t.date
       WHERE t.date = $1
       GROUP BY e.name, t.start_time, t.end_time`,
      [date]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении табеля за день:", error);
    res.status(500).json({ success: false, message: "Ошибка при получении табеля за день" });
  }
});

// Табель за месяц (GET)
router.get("/month", async (req, res) => {
  const { month, year } = req.query;

  try {
    const result = await db.query(
      `SELECT e.name,
              COUNT(t.date) AS days_worked,
              COUNT(*) FILTER (WHERE t.start_time IS NULL) AS missed_days,
              SUM(EXTRACT(EPOCH FROM (t.end_time - t.start_time))/3600 - 1) AS total_hours
       FROM timesheet t
       JOIN employees e ON e.id = t.employee_id
       WHERE EXTRACT(MONTH FROM t.date) = $1 AND EXTRACT(YEAR FROM t.date) = $2
       GROUP BY e.name`,
      [month, year]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении табеля за месяц:", error);
    res.status(500).json({ success: false, message: "Ошибка при получении табеля за месяц" });
  }
});

module.exports = router;
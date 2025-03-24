const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Получить табель за день
router.get("/day", async (req, res) => {
  const { date } = req.query;
  try {
    const employees = await db.query("SELECT id, name FROM users WHERE role NOT IN ('начальник', 'директор', 'снабженец')");

    const records = await Promise.all(
      employees.rows.map(async (emp) => {
        const timeRes = await db.query(
          "SELECT start_time, end_time FROM timesheet WHERE employee_id = $1 AND date = $2",
          [emp.id, date]
        );
        const taskRes = await db.query(
          "SELECT title FROM tasks WHERE employee_id = $1 AND date = $2",
          [emp.id, date]
        );

        return {
          name: emp.name,
          start_time: timeRes.rows[0]?.start_time || "",
          end_time: timeRes.rows[0]?.end_time || "",
          tasks: taskRes.rows.map((t) => t.title),
        };
      })
    );

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при получении табеля за день" });
  }
});

// Получить табель за месяц
router.get("/month", async (req, res) => {
  const { month } = req.query;
  try {
    const result = await db.query(
      `SELECT u.name, COUNT(t.*) AS workdays, 
        SUM(EXTRACT(EPOCH FROM (t.end_time - t.start_time))/3600) AS hours 
       FROM timesheet t
       JOIN users u ON u.id = t.employee_id
       WHERE TO_CHAR(t.date, 'YYYY-MM') = $1
       GROUP BY u.name`,
      [month]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при получении табеля за месяц" });
  }
});

// Добавить табель
router.post("/add", async (req, res) => {
  const { date, timesheet } = req.body;

  try {
    for (const [employee_id, time] of Object.entries(timesheet)) {
      await db.query(
        "INSERT INTO timesheet (employee_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) ON CONFLICT (employee_id, date) DO UPDATE SET start_time = $3, end_time = $4",
        [employee_id, date, time.start, time.end]
      );
    }

    res.json({ message: "Табель успешно сохранён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при сохранении табеля" });
  }
});

module.exports = router;
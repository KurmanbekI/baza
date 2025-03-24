// server/routes/auth.js
const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  
  try {
    const result = await db.query("SELECT * FROM users WHERE login = $1", [login]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    
    const user = result.rows[0];
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    
    res.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
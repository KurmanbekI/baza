const express = require('express');
const router = express.Router();
const db = require('../db'); // ✅ правильно
const bcrypt = require('bcrypt');

// 🔐 Авторизация по логину и паролю
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Ошибка авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
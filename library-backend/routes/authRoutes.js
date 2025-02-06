// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 注册 routes/authRoutes.js
router.post('/register', authController.register);
// 登录 routes/authRoutes.js
router.post('/login', authController.login);

module.exports = router;

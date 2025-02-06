// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * 用户注册
 * 1. 检查 username 是否已存在
 * 2. 若不存在，则 bcrypt.hash(password)，再插入数据库
 * 
 * *User Registration
 * 1. Check whether username exists
 * 2. If no, bcrypt.hash(password) is displayed and inserted into the database
 */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 1) 检查重复/Check repetition
    const [users] = await db.query('SELECT id FROM Users WHERE username = ?', [username]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // 2) 加密密码/Encryption cipher
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) 插入数据库/Insert database
    await db.query(
      'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 用户登录
 * 1. 根据 username 查询用户
 * 2. bcrypt.compare 对比密码
 * 3. 成功则 jwt.sign 生成 Token 返回
 * 
 * User Login
 * 1. Query the username by username
 * 2. bcrypt.compare compare passwords
 * 3. If successful, jwt.sign generates the Token and returns
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) 查找用户/Find a user
    const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const user = rows[0];

    // 2) 验证密码/Authentication password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 3) 生成 JWT/Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


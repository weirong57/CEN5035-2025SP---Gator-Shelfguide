// routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

// 借书 routes/borrowRoutes.js
router.post('/', borrowController.borrowBook);

// 还书 routes/borrowRoutes.js
router.post('/return', borrowController.returnBook);

module.exports = router;

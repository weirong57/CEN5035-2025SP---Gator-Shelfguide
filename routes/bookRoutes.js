// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, bookController.addBook);
// ...

// 图书列表 & 搜索  routes/bookRoutes.js
router.get('/', bookController.getAllBooks);

// 获取单本图书 routes/bookRoutes.js
router.get('/:id', bookController.getBookById);

// 添加图书 routes/bookRoutes.js
router.post('/', bookController.addBook);

// 更新图书 routes/bookRoutes.js.
router.put('/:id', bookController.updateBook);

// 删除图书 routes/bookRoutes.js
router.delete('/:id', bookController.deleteBook);

module.exports = router;

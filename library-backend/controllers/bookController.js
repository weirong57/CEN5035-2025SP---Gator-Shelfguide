// controllers/bookController.js
const db = require('../config/db');

/**
 * 获取所有图书/books/index
 * - 可选：支持按关键词搜索/title, author, genre
 */
exports.getAllBooks = async (req, res) => {
  try {
    // 如果想做关键字搜索，获取 query 参数，然后拼接 SQL/SQL query with search keyword
    const { search } = req.query;
    let sql = 'SELECT * FROM Books';
    let params = [];

    if (search) {
      sql += ' WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
      const wildcard = `%${search}%`;
      params = [wildcard, wildcard, wildcard];
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('getAllBooks Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 获取单本图书/by id
 */
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const [rows] = await db.query('SELECT * FROM Books WHERE id = ?', [bookId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getBookById Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 添加新书/by id
 */
exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      language,
      shelf_number,
      available_copies,
      isbn // Add isbn field
    } = req.body;

    const [result] = await db.query(
      'INSERT INTO Books (title, author, genre, language, shelf_number, available_copies, isbn) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, genre, language, shelf_number, available_copies || 1, isbn] // Include isbn in query
    );

    res.status(201).json({ message: 'Book added', bookId: result.insertId });
  } catch (err) {
    console.error('addBook Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * 更新图书信息/by id
 */
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const {
      title,
      author,
      genre,
      language,
      shelf_number,
      available_copies
    } = req.body;

    const [result] = await db.query(
      `UPDATE Books 
       SET title = ?, author = ?, genre = ?, language = ?, shelf_number = ?, available_copies = ? 
       WHERE id = ?`,
      [title, author, genre, language, shelf_number, available_copies, bookId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error('updateBook Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 删除图书/delete by id
 */
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const [result] = await db.query('DELETE FROM Books WHERE id = ?', [bookId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('deleteBook Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

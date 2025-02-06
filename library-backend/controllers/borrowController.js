// controllers/borrowController.js
const db = require('../config/db');

/**
 * 借书
 * 1. 检查 Books.available_copies 是否 > 0
 * 2. 如果可借 -> BorrowingRecords 插入一条记录(借阅日期, 到期日?), 并更新 Books.available_copies--
 * 
 * Borrow books
 * 1. Check whether Books.available_copies are > 0
 * 2. If available -> BorrowingRecords Insert a record (loan date, due date?) And update Books.available_copies--
 */
exports.borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    // 可根据需要从 token 里解析 userId，而不是从 body 传
    // const userId = req.user.userId; // 若使用了 authMiddleware

    // 1) 检查库存
    const [books] = await db.query('SELECT available_copies FROM Books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (books[0].available_copies < 1) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // 2) 借书记录
    const borrowedAt = new Date();
    // 随意设定到期日(比如两周后)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    await db.query(
      'INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)',
      [userId, bookId, borrowedAt, dueDate]
    );

    // 3) 更新库存
    await db.query(
      'UPDATE Books SET available_copies = available_copies - 1 WHERE id = ?',
      [bookId]
    );

    res.json({ message: 'Book borrowed successfully', dueDate });
  } catch (err) {
    console.error('borrowBook Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 还书
 * 1. 在 BorrowingRecords 中找到 userId + bookId + 没有 returned_at 的记录
 * 2. 更新 returned_at = now
 * 3. Books.available_copies++
 * 4. 可计算逾期
 * 
 * 
 * Return books
 * 1. Find userId + bookId + without returned_at in BorrowingRecords
 * 2. Update returned_at = now
 * 3. Books.available_copies++
 * 4. May be calculated overdue
 * /
 */
exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // 1) 查找未归还的借阅记录  Find the unreturned borrowing record
    const [records] = await db.query(
      `SELECT * FROM BorrowingRecords 
       WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
       ORDER BY borrowed_at DESC LIMIT 1`,
      [userId, bookId]
    );
    if (records.length === 0) {
      return res.status(404).json({ message: 'No matching borrow record found or already returned' });
    }
    const record = records[0];

    // 2) 更新 returned_at Update returned_at
    const returnedAt = new Date();
    await db.query(
      'UPDATE BorrowingRecords SET returned_at = ? WHERE id = ?',
      [returnedAt, record.id]
    );

    // 3) 更新库存 Update inventory
    await db.query(
      'UPDATE Books SET available_copies = available_copies + 1 WHERE id = ?',
      [bookId]
    );

    // 4) 可计算逾期（若需要） May be calculated overdue (if necessary)
    let overdueDays = 0;
    let fine = 0;
    if (returnedAt > record.due_date) {
      const diff = returnedAt - record.due_date; // 毫秒数  Milliseconds
      overdueDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      // 假设每天罚款 1 元  Assume a fine of 1 yuan per day
      fine = overdueDays * 1;
    }

    res.json({
      message: 'Book returned successfully',
      overdueDays,
      fine
    });
  } catch (err) {
    console.error('returnBook Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

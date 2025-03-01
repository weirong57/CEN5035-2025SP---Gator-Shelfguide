// src/pages/BookManagement.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Input, message, Modal } from 'antd';
import { bookService } from '../api/bookService';

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const response = await bookService.getBooks({
        search: searchKey,
        page: current,
        size: pageSize
      });
      
      setBooks(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [searchKey, pagination.current]);

  const handleAction = (action, record) => {
    Modal.confirm({
      title: `Are you sure to ${action === 'borrow' ? 'borrow' : 'return'}<${record.title}>?`,
      onOk: async () => {
        try {
          setLoading(true);
          if (action === 'borrow') {
            await bookService.borrowBook(record.id);
            message.success('Success');
          } else {
            await bookService.returnBook(record.id);
            message.success('Success');
          }
          await loadBooks();
        } catch (err) {
          message.error(err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    { 
      title: 'title', 
      dataIndex: 'title', 
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    { 
      title: 'author', 
      dataIndex: 'author', 
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author)
    },
    { 
      title: 'ISBN', 
      dataIndex: 'isbn', 
      key: 'isbn'
    },
    { 
      title: 'available copies', 
      dataIndex: 'available_copies', 
      key: 'available_copies',
      sorter: (a, b) => a.available_copies - b.available_copies
    },
    { 
      title: 'status', 
      render: (_, record) => (
        <span style={{ 
          color: record.available_copies > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 500
        }}>
          {record.available_copies > 0 ? 'remain' : 'No available books'}
        </span>
      )
    },
    {
      title: 'action',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            onClick={() => handleAction('borrow', record)}
            disabled={record.available_copies <= 0}
            style={{ minWidth: 80 }}
          >
            {record.available_copies > 0 ? 'remain' : 'empty'}
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleAction('return', record)}
            style={{ marginLeft: 8, minWidth: 80 }}
          >
            Return
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="book-management">
      <h2 style={{ marginBottom: 24 }}>📚 book-management system</h2>
      
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="enter title or author or ISBN to search..."
          allowClear
          enterButton="search"
          size="large"
          onSearch={loadBooks}
          onChange={(e) => setSearchKey(e.target.value)}
          style={{ maxWidth: 600 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showTotal: total => ` ${total} books in total`,
          onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
        }}
        bordered
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
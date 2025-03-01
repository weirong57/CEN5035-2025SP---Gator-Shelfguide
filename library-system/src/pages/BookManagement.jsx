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
      const encodedSearch = encodeURIComponent(searchKey);
      
      const response = await bookService.getBooks({
        title: encodedSearch,
        _page: pagination.current,
        _limit: pagination.pageSize
      });

      const rawData = Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response)
          ? response
          : [];

      console.log('[DEBUG] Processed data:', rawData);

      setBooks(rawData);
      
      setPagination(prev => ({
        ...prev,
        total: Number(response.headers?.['x-total-count']) || response.total || rawData.length
      }));
    } catch (err) {
      console.error('Data loading failed:', err);
      message.error(err.message);
      setBooks([]); 
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [pagination.current]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadBooks();
  };

  const handleAction = (action, record) => {
    Modal.confirm({
      title: `Confirm to ${action === 'borrow' ? 'borrow' : 'return'} "${record.title}"?`,
      onOk: async () => {
        try {
          setLoading(true);
          if (action === 'borrow') {
            await bookService.borrowBook(record.id);
          } else {
            await bookService.returnBook(record.id);
          }
          message.success('Operation successful');
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
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    { 
      title: 'Author', 
      dataIndex: 'author', 
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author)
    },
    { 
      title: 'ISBN', 
      dataIndex: 'isbn',
      key: 'isbn',
      render: text => text || <span style={{ color: '#bfbfbf' }}>N/A</span>
    },
    { 
      title: 'Available Copies', 
      dataIndex: 'available_copies', 
      key: 'available_copies',
      sorter: (a, b) => a.available_copies - b.available_copies,
      render: text => <span style={{ 
        fontWeight: 600,
        color: text > 0 ? '#389e0d' : '#cf1322'
      }}>{text}</span>
    },
    { 
      title: 'Status', 
      render: (_, record) => (
        <span style={{ 
          color: record.available_copies > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 500
        }}>
          {record.available_copies > 0 ? 'Available' : 'Out of Stock'} 
        </span>
      )
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            onClick={() => handleAction('borrow', record)}
            disabled={record.available_copies <= 0}
            style={{ minWidth: 80 }}
          >
            {record.available_copies > 0 ? 'Borrow' : 'Unavailable'} 
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
    <div className="book-management" style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>📚 Book Management System</h2>

      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by title/author/ISBN..."
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchKey(e.target.value)}
          onPressEnter={handleSearch}
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
          showTotal: total => `Total ${total} books`,
          onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
        }}
        bordered
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <img 
                src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" 
                alt="empty"
                style={{ width: 80, marginBottom: 16 }}
              />
              <p style={{ color: 'rgba(0,0,0,0.25)' }}>No Data</p>
            </div>
          )
        }}
      />
    </div>
  );
}
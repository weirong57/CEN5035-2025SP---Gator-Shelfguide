// src/pages/BookManagement.jsx
/*
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
}*/
// src/pages/BookManagement.jsx
// src/pages/BookManagement.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Input, message, Modal, Spin } from 'antd';
import axios from 'axios';

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [userId, setUserId] = useState(1); // Default userId - in real app should come from auth

  useEffect(() => {
    loadBooks();
  }, [pagination.current]); // Load books when page changes

  const loadBooks = async () => {
    try {
      setLoading(true);
   
      const params = {
        title: searchKey,
        page: pagination.current,
        limit: pagination.pageSize
      };
 
      if (!searchKey) {
        delete params.title;
      }

      const response = await axios.get('/api/books', { params });
      
      // Based on your API, the response should be an array of books
      if (Array.isArray(response.data)) {
        setBooks(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length
        }));
      } else {
        // In case response format is different
        console.warn('Unexpected response format:', response.data);
        setBooks([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error('Failed to load books:', error);
      message.error('Failed to load books. Please try again later.');
      setBooks([]); 
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, current: 1 }));
    loadBooks();
  };

  const handleAction = (action, record) => {
    Modal.confirm({
      title: `Confirm to ${action === 'borrow' ? 'borrow' : 'return'} "${record.title}"?`,
      content: action === 'borrow' 
        ? 'This will reduce the available copies by 1.' 
        : 'This will increase the available copies by 1.',
      onOk: async () => {
        try {
          setLoading(true);
          
          // Create the borrow/return request body according to API model
          const requestBody = {
            bookId: record.id,
            userId: userId // In a real app, this would be the logged-in user's ID
          };
          
          if (action === 'borrow') {
            // Call the borrow endpoint
            await axios.post('http://localhost:3000/borrow', requestBody);
            message.success(`Successfully borrowed "${record.title}"`);
          } else {
            // Call the return endpoint
            await axios.post('http://localhost:3000/borrow/return', requestBody);
            message.success(`Successfully returned "${record.title}"`);
          }
          
          // Reload books after successful operation
          await loadBooks();
        } catch (error) {
          console.error(`Failed to ${action} book:`, error);
          
          // Handle different error codes from API
          if (error.response?.status === 404) {
            action === 'borrow'
              ? message.error('Book not found or unavailable')
              : message.error('No active borrow record found');
          } else if (error.response?.status === 400) {
            message.error('Invalid request data');
          } else {
            message.error(`Failed to ${action} the book. Please try again.`);
          }
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
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: text => <span style={{ fontWeight: 500 }}>{text}</span>
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
      key: 'status',
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
      key: 'action',
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
            onClick={() => handleAction('return', record)}
            style={{ marginLeft: 8, minWidth: 80 }}
          >
            Return
          </Button>
        </div>
      )
    }
  ];

  if (loading && books.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="book-management">
      <h2 style={{ marginBottom: 24 }}>📚 Book Management System</h2>

      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by title/author/ISBN..."
          allowClear
          enterButton="Search"
          size="large"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onSearch={handleSearch}
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
          emptyText: searchKey ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: 'rgba(0,0,0,0.45)' }}>No books match your search criteria</p>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: 'rgba(0,0,0,0.45)' }}>No books available</p>
            </div>
          )
        }}
      />
    </div>
  );
}
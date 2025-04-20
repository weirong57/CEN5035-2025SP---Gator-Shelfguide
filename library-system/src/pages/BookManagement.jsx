/*
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
      console.log('Books data from API:', response.data);
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
    if (window.confirm(`Confirm to ${action === 'borrow' ? 'borrow' : 'return'} "${record.title}"?`)) {
      (async () => {
        try {
          setLoading(true);
          
          // 修改请求体中的字段名称，与后端BorrowRequest结构体匹配
          const requestBody = {
            bookID: record.id,  // 后端期望的是bookID而不是bookId
            userID: userId      // 使用组件状态中的userId，不是record.user_id
          };
          
          if (action === 'borrow') {
            // 注意API路径前缀保持与后端路由一致
            await axios.post('/api/borrow', requestBody);
            message.success(`Successfully borrowed "${record.title}"`);
          } else {
            await axios.post('/api/borrow/return', requestBody);
            message.success(`Successfully returned "${record.title}"`);
          }
          
          // 重新加载图书列表以显示更新后的可用副本数
          await loadBooks();
        } catch (error) {
          console.error(`Failed to ${action} book:`, error);
          
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
      })();
    }
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
          placeholder="Search by title/author"
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
}*/
// src/pages/BookManagement.jsx
// src/pages/BookManagement.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadBooks();
  }, [pagination.current]); 

  useEffect(() => {
    if (isAuthenticated()) {
      console.log('Authenticated user:', user);
    } else {
      console.log('User not authenticated');
    }
  }, [isAuthenticated, user]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const params = {
        title: searchKey,
        page: pagination.current,
        limit: pagination.pageSize
      };

      if (!searchKey) delete params.title;

      const response = await axios.get('/api/books', { 
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (Array.isArray(response.data)) {
        setBooks(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length
        }));
      } else {
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
    setPagination(prev => ({ ...prev, current: 1 }));
    loadBooks();
  };

  const handleAction = (action, record) => {
    if (!isAuthenticated()) {
      message.error('Please log in to perform this action');
      return;
    }

    console.log('Authentication status before action:', {
      isAuthenticated: isAuthenticated(),
      user,
      authToken: localStorage.getItem('authToken')
    });

    const confirmMessage = action === 'borrow' 
      ? `Confirm borrowing "${record.title}"?`
      : `Confirm returning "${record.title}"?`;

    if (window.confirm(confirmMessage)) {
      performAction(action, record.id);
    }
  };

  const performAction = async (action, bookId) => {
    try {
      console.log(`Performing ${action} action, Book ID:`, bookId);
      setLoading(true);
      
      const userId = user?.id || localStorage.getItem('userId');
      console.log('Using user ID:', userId);
      
      const requestBody = { 
        BookID: bookId,
        UserID: parseInt(userId),
        userId: parseInt(userId),
        userID: parseInt(userId),
        user_id: parseInt(userId)
      };
      
      const endpoint = action === 'borrow' ? '/api/borrow' : '/api/borrow/return';
      const token = localStorage.getItem('authToken');
      
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success(`Book ${action === 'borrow' ? 'borrowed' : 'returned'} successfully!`);
      await loadBooks();
    } catch (error) {
      console.error(`${action} error:`, error);
      
      if (error.response?.status === 401) {
        message.error('Authentication failed: ' + (error.response?.data || 'User ID not found'));
      } else {
        message.error(`Operation failed: ${error.response?.data || error.message}`);
      }
    } finally {
      setLoading(false);
    }
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
            disabled={!isAuthenticated() || record.available_copies <= 0}
            style={{ minWidth: 80 }}
          >
            {record.available_copies > 0 ? 'Borrow' : 'Unavailable'} 
          </Button>
          <Button
            type="default"
            onClick={() => handleAction('return', record)}
            disabled={!isAuthenticated()}
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
          placeholder="Search by title/author"
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
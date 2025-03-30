/*
// src/pages/UserCenter.jsx
import { useState } from 'react';
import { Table, Button, Tag, Modal, message } from 'antd';

// Mock data
const mockUser = {
  id: 1,
  username: 'John Doe',
  role: 'Regular User',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
};

const mockBorrows = [
  {
    id: 1,
    book: {
      id: 101,
      title: 'JavaScript Advanced Programming',
      author: 'Nicholas C. Zakas',
      isbn: '978-7-115-33091-5',
      cover: 'https://img1.doubanio.com/view/subject/l/public/s8958650.jpg'
    },
    borrowDate: '2023-07-15',
    dueDate: '2023-08-15',
    returned: false
  },
  {
    id: 2,
    book: {
      id: 102,
      title: 'React Design Patterns',
      author: 'Craig',
      isbn: '978-7-121-44321-6',
      cover: 'https://img9.doubanio.com/view/subject/l/public/s33834075.jpg'
    },
    borrowDate: '2023-07-20',
    dueDate: '2023-08-05', // Overdue test data
    returned: false
  },
  {
    id: 3,
    book: {
      id: 103,
      title: 'Node.js in Action',
      author: 'Mike Cantelon',
      isbn: '978-7-115-45678-9',
      cover: 'https://img2.doubanio.com/view/subject/l/public/s29427993.jpg'
    },
    borrowDate: '2023-06-10',
    dueDate: '2023-07-10',
    returned: true // Returned test data
  }
];

export default function UserCenter() {
  const [borrows, setBorrows] = useState(mockBorrows);
  const [currentUser] = useState(mockUser);

  // Simulate return operation
  const handleReturn = (record) => {
    Modal.confirm({
      title: `Confirm to return "${record.book.title}"?`,
      content: 'This is a frontend demo and will not submit real data',
      onOk: () => {
        setBorrows(prev => 
          prev.map(item => 
            item.id === record.id 
              ? { ...item, returned: true } 
              : item
          )
        );
        message.success('Return simulated successfully!');
      }
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Book Information',
      dataIndex: 'book',
      render: (book) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          < img 
            src={book.cover} 
            alt="Cover" 
            style={{ 
              width: 60, 
              height: 80, 
              marginRight: 16,
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <div>
            <h4 style={{ marginBottom: 4 }}>{book.title}</h4>
            <div style={{ color: '#666' }}>
              <Tag color="blue">{book.author}</Tag>
              <Tag>ISBN: {book.isbn}</Tag>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Borrow Date',
      dataIndex: 'borrowDate',
      width: 120,
      sorter: (a, b) => new Date(a.borrowDate) - new Date(b.borrowDate)
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      width: 120,
      render: (text, record) => {
        const isOverdue = new Date(text) < new Date();
        return (
          <span style={{ 
            color: isOverdue ? '#ff4d4f' : '#389e0d',
            fontWeight: 500
          }}>
            {text}
            {isOverdue && <Tag color="red" style={{ marginLeft: 8 }}>Overdue</Tag>}
          </span>
        );
      }
    },
    {
      title: 'Status',
      width: 100,
      render: (record) => (
        <Tag color={record.returned ? 'default' : 'success'}>
          {record.returned ? 'Returned' : 'Borrowing'}
        </Tag>
      )
    },
    {
      title: 'Action',
      width: 120,
      render: (record) => (
        !record.returned && (
          <Button 
            type="primary" 
            ghost
            onClick={() => handleReturn(record)}
          >
            Return Now
          </Button>
        )
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ 
        marginBottom: 24,
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        < img 
          src={currentUser.avatar} 
          alt="Avatar"
          style={{ 
            width: 64,
            height: 64,
            borderRadius: '50%',
            marginRight: 24
          }}
        />
        <div>
          <h2 style={{ marginBottom: 8 }}>{currentUser.username}</h2>
          <Tag color="gold">{currentUser.role}</Tag>
        </div>
      </div>

      <div style={{ 
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: 16 }}>📚 My Borrowing Records</h3>
        <Table
          columns={columns}
          dataSource={borrows}
          rowKey="id"
          pagination={{ 
            pageSize: 5,
            showTotal: total => `Total ${total} records`
          }}
          locale={{
            emptyText: (
              <div style={{ padding: 40, textAlign: 'center' }}>
                < img 
                  src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" 
                  alt="empty"
                  style={{ width: 80, marginBottom: 16 }}
                />
                <p style={{ color: 'rgba(0,0,0,0.25)' }}>No borrowing records</p >
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}*/
// src/pages/UserCenter.jsx
import { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  Modal, 
  message, 
  Spin,
  Alert 
} from 'antd';
import { 
  UserOutlined,
  LoadingOutlined,
  BookOutlined
} from '@ant-design/icons';
import apiClient from '../api/client';

const LoadingIndicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function UserCenter() {
  const [borrows, setBorrows] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and borrowing records
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const user = await apiClient.get('/users/me');
        setCurrentUser({
          ...user,
          createdAt: new Date(user.createdAt)
        });

        // Get borrowing records
        const borrowsData = await apiClient.get('/borrow', {
          params: { userId: user.id }
        });
        
        setBorrows(processBorrowData(borrowsData));
      } catch (err) {
        setError(err.message);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Transform API response to frontend format
  const processBorrowData = (data) => {
    return data.map(item => ({
      key: item.id,
      id: item.id,
      book: {
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        isbn: item.book.isbn
      },
      borrowDate: new Date(item.borrowDate).toLocaleDateString(),
      dueDate: new Date(item.dueDate).toLocaleDateString(),
      returned: item.status === 'RETURNED'
    }));
  };

  // Handle book return
  const handleReturn = async (record) => {
    Modal.confirm({
      title: `Confirm return "${record.book.title}"?`,
      content: 'Please ensure the book is in good condition',
      async onOk() {
        try {
          await apiClient.post('/borrow/return', {
            bookId: record.book.id,
            userId: currentUser.id
          });
          
          // Update local state
          setBorrows(prev => 
            prev.map(item => 
              item.id === record.id 
                ? { ...item, returned: true } 
                : item
            )
          );
          
          message.success('Book returned successfully');
        } catch (err) {
          message.error(err || 'Return failed');
        }
      }
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Book Information',
      dataIndex: 'book',
      render: (book) => (
        <div className="book-info">
          <h4>{book.title}</h4>
          <div className="meta">
            <Tag icon={<UserOutlined />} color="blue">{book.author}</Tag>
            <Tag icon={<BookOutlined />}>ISBN: {book.isbn}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Borrow Date',
      dataIndex: 'borrowDate',
      sorter: (a, b) => new Date(a.borrowDate) - new Date(b.borrowDate)
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (text, record) => (
        <span style={{ 
          color: new Date(record.dueDate) < new Date() ? '#ff4d4f' : '#389e0d',
          fontWeight: 500
        }}>
          {text}
        </span>
      )
    },
    {
      title: 'Status',
      render: (record) => (
        <Tag color={record.returned ? 'default' : 'success'}>
          {record.returned ? 'Returned' : 'Borrowing'}
        </Tag>
      )
    },
    {
      title: 'Action',
      render: (record) => (
        !record.returned && (
          <Button 
            type="primary" 
            ghost
            onClick={() => handleReturn(record)}
            disabled={loading}
          >
            Return
          </Button>
        )
      )
    }
  ];

  if (error) {
    return (
      <Alert
        type="error"
        message="Loading Error"
        description={error}
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={loading} indicator={LoadingIndicator}>
        {/* User Profile Section */}
        <Card
          title={<><UserOutlined /> User Profile</>}
          style={{ marginBottom: 24 }}
        >
          {currentUser && (
            <div className="user-info">
              <h3>{currentUser.username}</h3>
              <Tag color={currentUser.role === 'ADMIN' ? 'gold' : 'blue'}>
                {currentUser.role.toLowerCase()}
              </Tag>
              <div style={{ marginTop: 8 }}>
                <Tag color="geekblue">
                  Registered: {currentUser.createdAt.toLocaleDateString()}
                </Tag>
              </div>
            </div>
          )}
        </Card>

        {/* Borrowing History Section */}
        <Card title={<><BookOutlined /> Borrowing History</>}>
          <Table
            columns={columns}
            dataSource={borrows}
            rowKey="id"
            pagination={{ 
              pageSize: 5,
              showTotal: total => `Total ${total} records`
            }}
            locale={{
              emptyText: (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <p style={{ color: 'rgba(0,0,0,0.25)' }}>
                    No borrowing records found
                  </p >
                </div>
              )
            }}
          />
        </Card>
      </Spin>
    </div>
  );
}
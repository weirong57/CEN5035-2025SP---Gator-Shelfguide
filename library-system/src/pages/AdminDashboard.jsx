/*
import { useState } from 'react';
import { 
  Tabs, 
  Card, 
  Table, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Statistic, 
  Row, 
  Col, 
  Tag, 
  Modal 
} from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  BarChartOutlined,
  PlusOutlined 
} from '@ant-design/icons';

const { TabPane } = Tabs;

// Mock data
const mockData = {
  books: [
    { id: 1, title: 'JavaScript Advanced Programming', author: 'Nicholas C. Zakas', isbn: '978-7-115-33091-5', available: 5 },
    { id: 2, title: 'React Design Patterns', author: 'Craig', isbn: '978-7-121-44321-6', available: 3 }
  ],
  users: [
    { id: 1, username: 'john_doe', role: 'admin', registered: '2023-01-15' },
    { id: 2, username: 'jane_smith', role: 'user', registered: '2023-02-20' }
  ],
  borrows: [
    { id: 1, user: 'john_doe', book: 'JavaScript Advanced Programming', borrowDate: '2023-07-01', dueDate: '2023-08-01', status: 'active' }
  ],
  stats: {
    totalBooks: 2356,
    activeUsers: 1342,
    activeBorrows: 589
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);

  // Table columns configuration
  const bookColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn'
    },
    {
      title: 'Stock',
      dataIndex: 'available',
      render: text => <Tag color={text > 0 ? 'green' : 'red'}>{text}</Tag>
    },
    {
      title: 'Actions',
      render: () => (
        <div>
          <Button type="link">Edit</Button>
          <Button type="link" danger>Delete</Button>
        </div>
      )
    }
  ];

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: text => <Tag color={text === 'admin' ? 'gold' : 'blue'}>{text}</Tag>
    },
    {
      title: 'Registration Date',
      dataIndex: 'registered'
    },
    {
      title: 'Actions',
      render: () => <Button type="link">Edit Role</Button>
    }
  ];

  const borrowColumns = [
    {
      title: 'User',
      dataIndex: 'user'
    },
    {
      title: 'Book',
      dataIndex: 'book'
    },
    {
      title: 'Borrow Date',
      dataIndex: 'borrowDate'
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (text, record) => (
        <span style={{ color: new Date(text) < new Date() ? 'red' : 'inherit' }}>
          {text}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: text => (
        <Tag color={text === 'active' ? 'green' : 'volcano'}>
          {text === 'active' ? 'Active' : 'Returned'}
        </Tag>
      )
    }
  ];

  const handleAddBook = () => {
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      Modal.success({
        title: 'Success',
        content: 'New book added successfully (demo)'
      });
      handleModalCancel();
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Books"
              value={mockData.stats.totalBooks}
              prefix={<BookOutlined />}
              suffix="volumes"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={mockData.stats.activeUsers}
              prefix={<UserOutlined />}
              suffix="users"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Borrows"
              value={mockData.stats.activeBorrows}
              prefix={<ShoppingOutlined />}
              suffix="times"
            />
          </Card>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" onChange={setActiveTab}>
        <TabPane tab={<span><BookOutlined />Book Management</span>} key="1">
          <Card
            title="Book List"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBook}>
                Add New Book
              </Button>
            }
          >
            <Table
              columns={bookColumns}
              dataSource={mockData.books}
              rowKey="id"
              bordered
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><UserOutlined />User Management</span>} key="2">
          <Card title="User List">
            <Table
              columns={userColumns}
              dataSource={mockData.users}
              rowKey="id"
              bordered
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><BarChartOutlined />Borrow Records</span>} key="3">
          <Card title="All Borrow Records">
            <Table
              columns={borrowColumns}
              dataSource={mockData.borrows}
              rowKey="id"
              bordered
            />
          </Card>
        </TabPane>
      </Tabs>
      <Modal 
        title="Add New Book" 
        visible={showModal} 
        onOk={handleSubmit}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="ISBN" name="isbn">
            <Input />
          </Form.Item>
          <Form.Item label="Stock Quantity" name="available">
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}*/
// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Tabs, 
  Card, 
  Table, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Statistic, 
  Row, 
  Col, 
  Tag, 
  Modal,
  message 
} from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  BarChartOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import axios from 'axios'; // Axios needs to be installed

const API_BASE = 'http://localhost:3000'; // Backend API base URL
const { TabPane } = Tabs;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dynamic data states
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    activeBorrows: 0
  });

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const [booksRes, usersRes, borrowsRes] = await Promise.all([
        axios.get(`${API_BASE}/books`),
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/borrow`)
      ]);
      
      setStats({
        totalBooks: booksRes.data.length,
        activeUsers: usersRes.data.length,
        activeBorrows: borrowsRes.data.length
      });
    } catch (error) {
      message.error('Failed to fetch statistics');
    }
  };

  // Fetch book data
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/books`);
      setBooks(res.data);
    } catch (error) {
      message.error('Failed to fetch book data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (error) {
      message.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch borrow records
  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/borrow`);
      setBorrows(res.data);
    } catch (error) {
      message.error('Failed to fetch borrow records');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchStats();
    fetchBooks();
    fetchUsers();
    fetchBorrows();
  }, []);

  // Table columns configuration
  const bookColumns = [
    { title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: 'Author', dataIndex: 'author' },
    { title: 'ISBN', dataIndex: 'isbn' },
    { 
      title: 'Stock', 
      dataIndex: 'available_copies',
      render: text => <Tag color={text > 0 ? 'green' : 'red'}>{text}</Tag>
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleEditBook(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteBook(record.id)}>Delete</Button>
        </div>
      )
    }
  ];

  // Add new book
  const handleAddBook = async values => {
    try {
      await axios.post(`${API_BASE}/books`, values);
      message.success('Book added successfully');
      fetchBooks();
      setShowModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add book');
    }
  };

  // Delete book
  const handleDeleteBook = async id => {
    try {
      await axios.delete(`${API_BASE}/books/${id}`);
      message.success('Deleted successfully');
      fetchBooks();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  // Edit book
  const handleEditBook = async (values, id) => {
    try {
      await axios.put(`${API_BASE}/books/${id}`, values);
      message.success('Updated successfully');
      fetchBooks();
      setShowModal(false);
    } catch (error) {
      message.error('Failed to update');
    }
  };

  // Update user role
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE}/users/${userId}`, { role: newRole });
      message.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to update role');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Statistics card section remains unchanged */}
      
      <Tabs defaultActiveKey="1" onChange={setActiveTab}>
        <TabPane tab={<span><BookOutlined />Book Management</span>} key="1">
          <Card
            title="Book List"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
                Add New Book
              </Button>
            }
          >
            <Table
              columns={bookColumns}
              dataSource={books}
              rowKey="id"
              loading={loading}
              bordered
            />
          </Card>
        </TabPane>

        {/* User Management TabPane */}
        <TabPane tab={<span><UserOutlined />User Management</span>} key="2">
          <Card title="User List">
            <Table
              columns={[
                { title: 'Username', dataIndex: 'username' },
                { 
                  title: 'Role', 
                  dataIndex: 'role',
                  render: (text, record) => (
                    <Tag 
                      color={text === 'admin' ? 'gold' : 'blue'}
                      onClick={() => {
                        Modal.confirm({
                          title: 'Change User Role',
                          content: `Are you sure you want to change ${record.username}'s role?`,
                          onOk: () => handleRoleUpdate(record.id, text === 'admin' ? 'user' : 'admin')
                        });
                      }}
                    >
                      {text}
                    </Tag>
                  )
                },
                { title: 'Registration Date', dataIndex: 'registered' }
              ]}
              dataSource={users}
              rowKey="id"
              loading={loading}
              bordered
            />
          </Card>
        </TabPane>

        {/* Borrow Records TabPane */}
        <TabPane tab={<span><BarChartOutlined />Borrow Records</span>} key="3">
          <Card title="All Borrow Records">
            <Table
              columns={[
                { title: 'User', dataIndex: ['user', 'username'] },
                { title: 'Book', dataIndex: ['book', 'title'] },
                { title: 'Borrow Date', dataIndex: 'borrowDate' },
                { 
                  title: 'Due Date', 
                  dataIndex: 'dueDate',
                  render: text => (
                    <span style={{ color: new Date(text) < new Date() ? 'red' : 'inherit' }}>
                      {text}
                    </span>
                  )
                },
                { 
                  title: 'Status', 
                  dataIndex: 'status',
                  render: text => (
                    <Tag color={text === 'active' ? 'green' : 'volcano'}>
                      {text === 'active' ? 'Active' : 'Returned'}
                    </Tag>
                  )
                }
              ]}
              dataSource={borrows}
              rowKey="id"
              loading={loading}
              bordered
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add/Edit Book Modal */}
      <Modal 
        title="Add New Book" 
        visible={showModal} 
        onOk={() => form.submit()}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleAddBook}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ISBN" name="isbn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            label="Stock Quantity" 
            name="available_copies"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

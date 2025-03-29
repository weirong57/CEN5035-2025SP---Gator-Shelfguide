// src/pages/AdminDashboard.jsx
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
      {/* Statistics Cards */}
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

      {/* Functional Tabs */}
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

      {/* Add Book Modal */}
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
}
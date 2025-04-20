import { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Tag, 
  message, 
  Spin,
  Alert,
  Tabs,
  Empty,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  UserOutlined,
  BookOutlined,
  HistoryOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'; // 导入认证上下文

const { TabPane } = Tabs;

export default function UserCenter() {
  const [borrows, setBorrows] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  
  // 使用认证上下文获取当前用户信息
  const { user, isAuthenticated } = useAuth();

  // 当认证状态或用户信息改变时加载数据
  useEffect(() => {
    if (isAuthenticated() && user) {
      loadUserData();
    }
  }, [user, isAuthenticated]);

  // 标签页切换时加载对应数据
  useEffect(() => {
    if (currentUser) {
      if (activeTab === '1') {
        loadBorrowingRecords();
      }
    }
  }, [activeTab, currentUser]);

  // 加载用户信息
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.id) {
        throw new Error('User ID not available');
      }
      
      console.log('加载用户信息，用户ID:', user.id);
      
      // 调用后端API获取用户信息
      const response = await axios.get(`/api/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.data) {
        setCurrentUser(response.data);
      } else {
        throw new Error('Failed to fetch user data');
      }
      
      // 加载初始标签页数据
      if (activeTab === '1') {
        await loadBorrowingRecords();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 加载用户借阅记录
  const loadBorrowingRecords = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.id) {
        throw new Error('User ID not available');
      }
      
      console.log(`正在请求借阅记录: /api/users/${user.id}/borrowings`);
      
      // 调用后端API获取借阅记录
      const response = await axios.get(`/api/users/${user.id}/borrowings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      console.log('借阅记录原始数据:', response.data);
      
      if (Array.isArray(response.data)) {
        // 处理借阅记录
        const processedBorrows = response.data.map(record => {
          console.log('处理记录:', record, 'returned_at值:', record.returned_at);
          
          // 检查返回状态
          const isReturned = record.returned_at && record.returned_at.Valid === true;
          
          return {
            id: record.id || Math.random().toString(36).substring(7),
            book: {
              id: record.book_id,
              title: record.title,
              author: record.author,
              isbn: record.isbn
            },
            borrowDate: record.borrowed_at,
            dueDate: record.due_date,
            returned: isReturned,
            status: record.status
          };
        });
        
        console.log('处理后的借阅记录:', processedBorrows);
        setBorrows(processedBorrows);
      } else {
        console.warn('API返回的不是数组格式:', response.data);
        setBorrows([]);
      }
    } catch (error) {
      console.error('Failed to load borrowing records:', error);
      message.error('Failed to load borrowing history');
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // 检查是否逾期
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // 借阅记录表格列
  const borrowColumns = [
    {
      title: 'Book Information',
      dataIndex: 'book',
      key: 'book',
      render: (book) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{book.title}</div>
          <div>
            <Tag color="blue">{book.author}</Tag>
            <Tag>ISBN: {book.isbn}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Borrow Date',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (date) => formatDate(date)
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date, record) => (
        <span style={{ 
          color: isOverdue(date) && !record.returned ? '#ff4d4f' : 'inherit',
          fontWeight: isOverdue(date) && !record.returned ? 'bold' : 'normal'
        }}>
          {formatDate(date)}
          {isOverdue(date) && !record.returned && (
            <Tag color="red" style={{ marginLeft: 8 }}>Overdue</Tag>
          )}
        </span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.returned ? 'default' : 'success'}>
          {record.status || (record.returned ? 'Returned' : 'Borrowing')}
        </Tag>
      )
    }
  ];

  // 认证状态检查
  if (!isAuthenticated()) {
    return (
      <Alert
        type="warning"
        message="Authentication Required"
        description="Please log in to view your account information."
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  // 错误处理
  if (error) {
    return (
      <Alert
        type="error"
        message="Error"
        description={error}
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={loading && !currentUser}>
        {currentUser && (
          <Card
            title={<><UserOutlined /> User Information</>}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={24} md={8}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar icon={<UserOutlined />} size={64} style={{ marginRight: 16 }} />
                  <div>
                    <h3>{currentUser.username}</h3>
                    <Tag color={currentUser.role === 'admin' ? 'gold' : 'blue'}>
                      {currentUser.role || 'User'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={24} md={16}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Registration Date"
                      value={formatDate(currentUser.created_at)}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Borrowed Books"
                      value={borrows.length}
                      prefix={<BookOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Current Borrowings"
                      value={borrows.filter(b => !b.returned).length}
                      prefix={<BookOutlined />}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<span><HistoryOutlined /> Borrowing History</span>}
            key="1"
          >
            <Spin spinning={loading && currentUser}>
              <Table
                columns={borrowColumns}
                dataSource={borrows}
                rowKey="id"
                pagination={{ 
                  pageSize: 5,
                  showTotal: total => `Total ${total} records`
                }}
                locale={{
                  emptyText: (
                    <Empty 
                      description="No borrowing records found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )
                }}
              />
            </Spin>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}

// Avatar组件定义
const Avatar = ({ icon, size = 32, style = {} }) => {
  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#1890ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size / 2,
        ...style
      }}
    >
      {icon}
    </div>
  );
};
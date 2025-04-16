/*// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Divider, Tag } from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  ShoppingCartOutlined,
  BarChartOutlined 
} from '@ant-design/icons';

// Mock data
const mockStats = {
  totalBooks: 2356,
  totalUsers: 1342,
  activeBorrows: 589,
  popularBooks: [
    { name: 'JavaScript Advanced Programming', count: 289 },
    { name: 'React Design Patterns', count: 215 },
    { name: 'Node.js in Action', count: 198 }
  ]
};

export default function Dashboard() {
  const [stats] = useState(mockStats);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>📊 System Overview</h2>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Books"
              value={stats.totalBooks}
              prefix={<BookOutlined />}
              suffix="volumes"
            />
            <Progress
              percent={100}
              showInfo={false}
              strokeColor="#1890ff"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Registered Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              suffix="users"
            />
            <Progress
              percent={100}
              showInfo={false}
              strokeColor="#52c41a"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Active Borrows"
              value={stats.activeBorrows}
              prefix={<ShoppingCartOutlined />}
              suffix="times"
            />
            <Progress
              percent={100}
              showInfo={false}
              strokeColor="#faad14"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8 }} />
                Popular Books Ranking
              </span>
            }
          >
            {stats.popularBooks.map((book, index) => (
              <div 
                key={book.name}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  margin: '12px 0',
                  padding: 8,
                  background: index % 2 === 0 ? '#fafafa' : 'white',
                  borderRadius: 4
                }}
              >
                <span style={{ 
                  width: 24, 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#666'
                }}>
                  #{index + 1}
                </span>
                <span style={{ flex: 1, marginLeft: 16 }}>{book.name}</span>
                <Tag color="geekblue">{book.count} borrows</Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card style={{ marginTop: 24 }}>
        <h3>🏛️ Welcome to Library Management System</h3>
        <p style={{ color: '#666', marginTop: 8 }}>
          System is running normally. Last updated: 2023-07-25 14:30:45
        </p >
      </Card>
    </div>
  );
}*/
import { Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div>
        <SmileOutlined style={{ fontSize: 64, color: '#1890ff' }} />
        <Title level={2} style={{ margin: '24px 0' }}>
          Welcome to Library Management System
        </Title>
        <Paragraph type="secondary">
          Please use the navigation menu to get started
        </Paragraph>
      </div>
    </div>
  );
}
// src/pages/UserCenter.jsx
import { useState } from 'react';
import { Table, Button, Tag, Modal, message } from 'antd';

// 模拟数据
const mockUser = {
  id: 1,
  username: '张三',
  role: '普通用户',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
};

const mockBorrows = [
  {
    id: 1,
    book: {
      id: 101,
      title: 'JavaScript高级程序设计',
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
      title: 'React设计原理',
      author: '卡拉克（Craig）',
      isbn: '978-7-121-44321-6',
      cover: 'https://img9.doubanio.com/view/subject/l/public/s33834075.jpg'
    },
    borrowDate: '2023-07-20',
    dueDate: '2023-08-05', // 已逾期的测试数据
    returned: false
  },
  {
    id: 3,
    book: {
      id: 103,
      title: 'Node.js实战',
      author: 'Mike Cantelon',
      isbn: '978-7-115-45678-9',
      cover: 'https://img2.doubanio.com/view/subject/l/public/s29427993.jpg'
    },
    borrowDate: '2023-06-10',
    dueDate: '2023-07-10',
    returned: true // 已归还的测试数据
  }
];

export default function UserCenter() {
  const [borrows, setBorrows] = useState(mockBorrows);
  const [currentUser] = useState(mockUser);

  // 模拟归还操作
  const handleReturn = (record) => {
    Modal.confirm({
      title: `确认归还《${record.book.title}》吗？`,
      content: '此操作仅前端演示，不会真实提交数据',
      onOk: () => {
        // 前端模拟归还效果
        setBorrows(prev => 
          prev.map(item => 
            item.id === record.id 
              ? { ...item, returned: true } 
              : item
          )
        );
        message.success('模拟归还成功！');
      }
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '图书信息',
      dataIndex: 'book',
      render: (book) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          < img 
            src={book.cover} 
            alt="封面" 
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
      title: '借阅日期',
      dataIndex: 'borrowDate',
      width: 120,
      sorter: (a, b) => new Date(a.borrowDate) - new Date(b.borrowDate)
    },
    {
      title: '应还日期',
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
            {isOverdue && <Tag color="red" style={{ marginLeft: 8 }}>已逾期</Tag>}
          </span>
        );
      }
    },
    {
      title: '状态',
      width: 100,
      render: (record) => (
        <Tag color={record.returned ? 'default' : 'success'}>
          {record.returned ? '已归还' : '借阅中'}
        </Tag>
      )
    },
    {
      title: '操作',
      width: 120,
      render: (record) => (
        !record.returned && (
          <Button 
            type="primary" 
            ghost
            onClick={() => handleReturn(record)}
          >
            立即归还
          </Button>
        )
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 用户信息卡片 */}
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
          alt="用户头像"
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

      {/* 借阅记录表格 */}
      <div style={{ 
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: 16 }}>📚 我的借阅记录</h3>
        <Table
          columns={columns}
          dataSource={borrows}
          rowKey="id"
          pagination={{ 
            pageSize: 5,
            showTotal: total => `共 ${total} 条记录`
          }}
          locale={{
            emptyText: (
              <div style={{ padding: 40, textAlign: 'center' }}>
                < img 
                  src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" 
                  alt="empty"
                  style={{ width: 80, marginBottom: 16 }}
                />
                <p style={{ color: 'rgba(0,0,0,0.25)' }}>暂无借阅记录</p >
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
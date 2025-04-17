/*import { Menu, Layout } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const items = [
  {
    key: '/main/dashboard',
    icon: <DashboardOutlined />,
    label: 'Main page'
  },
  {
    key: '/main/books',
    icon: <BookOutlined />,
    label: 'Book Management'
  },
  {
    key: '/main/users',
    icon: <UserOutlined />,
    label: 'User Center'
  },
  {
    key: '/main/reports',
    icon: <BarChartOutlined />,
    label: 'Search'
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getSelectedKey = () => {
    const basePath = location.pathname.split('/').slice(0, 3).join('/')
    return items.find(item => item.key === basePath)?.key || ''
  }

  return (
    <Sider
      theme="light"
      collapsible
      breakpoint="lg"
      width={220}
    >
      <div className="logo" style={{ 
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }}>
        Library
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={items}
        onSelect={({ key }) => navigate(key)}
      />
    </Sider>
  )
}*/
import { Menu, Layout } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const { Sider } = Layout;

export default function Sidebar({ userRole = 'user' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Define menu items based on user role
    const baseItems = [
      {
        key: '/main/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
      },
      {
        key: '/main/books',
        icon: <BookOutlined />,
        label: 'Book Catalog'
      },
      {
        key: '/main/users',
        icon: <UserOutlined />,
        label: 'My Account'
      },
      {
        key: '/main/reviews',
        icon: <StarOutlined />,
        label: 'Book Reviews'
      }
    ];

    // Set the menu items
    setMenuItems(baseItems);
  }, [userRole]);

  const getSelectedKey = () => {
    const basePath = location.pathname.split('/').slice(0, 3).join('/');
    return menuItems.find(item => item.key === basePath)?.key || '';
  };

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      width={220}
    >
      <div className="logo" style={{ 
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: collapsed ? 16 : 20,
        fontWeight: 'bold',
        color: '#4e789f'
      }}>
        {collapsed ? '📚' : 'Gator Shelf'}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onSelect={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
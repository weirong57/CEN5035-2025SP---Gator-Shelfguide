import { Menu, Layout } from 'antd'
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
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard'
  },
  {
    key: '/books',
    icon: <BookOutlined />,
    label: 'Book management'
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: 'User center'
  },
  {
    key: '/reports',
    icon: <BarChartOutlined />,
    label: 'Reports'
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

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
        selectedKeys={[location.pathname]}
        items={items}
        onSelect={({ key }) => navigate(key)}
      />
    </Sider>
  )
}
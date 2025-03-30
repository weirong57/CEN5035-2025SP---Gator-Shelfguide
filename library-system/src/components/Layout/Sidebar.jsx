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
    label: 'Reports'
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
}
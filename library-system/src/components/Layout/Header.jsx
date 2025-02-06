import { Layout, Dropdown, Space, Avatar } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function AppHeader() {
  return (
    <Header style={{ 
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      <Dropdown
        menu={{
          items: [
            { key: 'profile', label: 'Personal center' },
            { key: 'logout', label: 'Logout' }
          ]
        }}
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>Admin</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  )
}
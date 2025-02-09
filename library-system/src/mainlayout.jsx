import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { 
  Dashboard,
  BookManagement,
  UserCenter,
  Reports 
} from './pages';
import './App.css';  

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ 
      minHeight: '100vh',
      minWidth:'100vw',
      background: '#f0f2f5'  
    }}>

      <Sidebar />
      

      <Layout>

        <Header />
        

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#ffffff',  
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'  
          }}
        >

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/users" element={<UserCenter />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

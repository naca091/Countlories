import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import CategoryList from '../Categories/CategoryList';
import IngredientList from '../Ingredients/IngredientList';
import MenuList from '../Menus/MenuList';
import RoleList from '../Roles/RoleList';
import UserList from '../Users/UserList';
import VideoList from '../Video/VideoList';

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <IngredientList />;
      case '2':
        return <CategoryList />;
      case '3':
        return <MenuList />;
      case '4':
        return <RoleList />;
      case '5':
        return <UserList />;
      default:
        return <div className="p-6"><h1 className="text-2xl font-bold">Dashboard Overview</h1></div>;
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: 'Categories'
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: 'Users'
    },
    {
      key: '4',
      icon: <FileTextOutlined />,
      label: 'Orders'
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>
            Admin Panel
          </h1>
          {collapsed && <DashboardOutlined style={{ fontSize: '24px' }} />}
        </div>
        <Menu
          theme="light"
          selectedKeys={[selectedMenu]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
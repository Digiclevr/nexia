import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  CloudServerOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Sider, Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 112px);
`;

const CollapsedLogo = styled.div`
  text-align: center;
  padding: 16px 0;
  font-size: 24px;
`;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/'
  },
  {
    key: '/reports',
    icon: <FileTextOutlined />,
    label: 'Reports',
    path: '/reports'
  },
  {
    key: '/trends',
    icon: <LineChartOutlined />,
    label: 'Trends',
    path: '/trends'
  },
  {
    key: '/clusters',
    icon: <CloudServerOutlined />,
    label: 'Clusters',
    path: '/clusters'
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    path: '/settings'
  }
];

const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings'
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout'
  }
];

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find(item => item.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        // Handle profile navigation
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // Handle logout
        console.log('Logout clicked');
        break;
      default:
        break;
    }
  };

  const refreshData = () => {
    // Trigger data refresh
    window.location.reload();
  };

  return (
    <StyledLayout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={240}
      >
        {collapsed ? (
          <CollapsedLogo>🏥</CollapsedLogo>
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #001529' }}>
            <Logo style={{ color: '#fff' }}>
              🏥 NEXIA
            </Logo>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
              Health Monitor
            </div>
          </div>
        )}
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <AntLayout>
        <StyledHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 48, height: 48 }}
            />
            
            <div style={{ marginLeft: '16px', color: '#8c8c8c', fontSize: '14px' }}>
              Kubernetes Cluster Health Monitoring
            </div>
          </div>

          <HeaderActions>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={refreshData}
              title="Refresh Data"
            >
              Refresh
            </Button>
            
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                title="Notifications"
              />
            </Badge>

            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
            >
              <Avatar 
                style={{ backgroundColor: '#667eea', cursor: 'pointer' }} 
                icon={<UserOutlined />} 
              />
            </Dropdown>
          </HeaderActions>
        </StyledHeader>
        
        <StyledContent>
          {children}
        </StyledContent>
      </AntLayout>
    </StyledLayout>
  );
};

export default Layout;
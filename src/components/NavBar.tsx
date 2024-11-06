import React, { ReactNode, useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SnippetsOutlined,
  LogoutOutlined,
  ProfileOutlined,
  BookOutlined,
  ZoomInOutlined,
  HeartOutlined
} from '@ant-design/icons';
import AuthorizeApi from "../api/authorizeApi";
import { Button, Dropdown, Avatar, Space, Menu, Layout, theme, Typography } from 'antd';
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../stores/user.store';
import { useNavigate } from "react-router-dom";
import UserApi from "../api/userApi";
const { Text } = Typography;

const { Header, Sider, Content } = Layout;

interface NavBarProps {
  children: ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {  
  const [collapsed, setCollapsed] = useState(false);
  const [state, actions] = useUserStore();
  const [id, setId] = useState<string>("");
  const [username, setUsername] = useState<string>();
  const isAuthenticated = AuthorizeApi.isSignedIn();
  const token = AuthLocalStorage.getToken() as string;

  const navigate = useNavigate();

  const userService = new UserApi();
  const authService = new AuthorizeApi();

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    if(isAuthenticated){
       const user: any = jwtDecode(token);
       const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
       await userService.getById(userId)
       .then(async (response) => {
         state.currentUserId = userId;
         setUsername(response.data.firstName);
         setId(userId);
       });
     }
   };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      setUsername("Guest");
      console.log('User logged out');
    } else if (key === 'profile') {
      console.log('Navigate to profile');
    }
  };

  const toLogin = () => {
    navigate("../login", { replace: true });
  };

  const checkAuthenticationAndNavigate = (path: string) => {
    if (isAuthenticated) {
      navigate(path, { replace: true });
    } else {
      navigate("../login", { replace: true });
    }
  };

  const toDiary = () => checkAuthenticationAndNavigate("../diary");
  const toSpecialists = () => checkAuthenticationAndNavigate("../therapists");
  const toMeetings = () => checkAuthenticationAndNavigate("../meetings");
  const toRecommendations = () => checkAuthenticationAndNavigate("../recommendation");

  const handleLogOut = () => {
    authService.logout();
    navigate("../main", { replace: true });
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" onClick={() => checkAuthenticationAndNavigate("../profile")} icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogOut} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={styles.logoContainer} onClick={() => navigate("/main")}>
          <HeartOutlined style={styles.logoIcon} />
          {!collapsed && <Text style={styles.logoText}>TherapyAPI</Text>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <BookOutlined />,
              label: 'Diary',
              onClick: toDiary
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Specialists',
              onClick: toSpecialists
            },
            {
              key: '3',
              icon: <SnippetsOutlined />,
              label: 'Meetings',
              onClick: toMeetings
            },
            {
              key: '4',
              icon: <ZoomInOutlined />,
              label: 'Recommendation',
              onClick: toRecommendations
            },
          ]}
        />
        {!collapsed &&
        <div style={styles.footer}>
          <p style={styles.footerText}>© 2024 TherapyApp</p>
          <p style={styles.footerText}>Contact: support@therapyapp.com</p>
        </div>}
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <div>
            {isAuthenticated ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>Welcome, {username}</span>
                </Space>
              </Dropdown>
            ) : (
              <Button type="primary" onClick={toLogin}>Login</Button>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 620,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default NavBar;

const styles = {
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '24px',
  } as React.CSSProperties,
  logoIcon: {
    fontSize: '32px',
    marginRight: '8px',
    color: '#1890ff',
  } as React.CSSProperties,
  logoText: {
    color: 'white',
    fontWeight: 'bold',
  } as React.CSSProperties,
  footer: {
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: '12px',
    padding: '10px 0',
  } as React.CSSProperties,
  footerText: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.7)',
  } as React.CSSProperties,
};
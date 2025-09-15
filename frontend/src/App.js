import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider, theme } from 'antd';
import { Helmet } from 'react-helmet';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Trends from './pages/Trends';
import Clusters from './pages/Clusters';
import Settings from './pages/Settings';

// Services
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Custom theme
const customTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#667eea',
    colorBgContainer: '#ffffff',
    borderRadius: 8,
    colorText: '#2c3e50',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#001529',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={customTheme}>
        <Router>
          <Helmet>
            <title>🏥 NEXIA - Kubernetes Health Monitor</title>
            <meta name="description" content="Real-time Kubernetes cluster health monitoring and analytics" />
          </Helmet>
          
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/clusters" element={<Clusters />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
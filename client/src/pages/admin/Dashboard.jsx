import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import { RiDashboardLine, RiShoppingBag3Line, RiArtboard2Line, 
         RiMailLine, RiUserLine, RiMoneyDollarCircleLine, 
         RiSettings4Line, RiBarChart2Line } from 'react-icons/ri';
import adminTheme from '../../theme/adminTheme';
import Spinner from '../../components/ui/Spinner';

// Lazy loaded components
const Sidebar = lazy(() => import('../../components/layout/admin/Sidebar'));
const Header = lazy(() => import('../../components/layout/admin/Header'));
const AnalyticsOverview = lazy(() => import('../../components/layout/admin/AnalyticsOverview'));
const RecentOrders = lazy(() => import('../../components/layout/admin/RecentOrders'));
const TopProducts = lazy(() => import('../../components/layout/admin/TopProducts'));
const Products = lazy(() => import('./Products'));

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: '280px', // Sidebar width
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const LoadingFallback = () => <Spinner />;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <DashboardContainer>
        <Suspense fallback={<LoadingFallback />}>
          <Sidebar isOpen={isSidebarOpen} />
          <MainContent>
            <Header toggleSidebar={toggleSidebar} />
            
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                      <Suspense fallback={<Spinner />}>
                        <AnalyticsOverview />
                      </Suspense>
                    </Box>

                    <Box sx={{ mt: 4, display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                      <Suspense fallback={<Spinner />}>
                        <RecentOrders />
                        <TopProducts />
                      </Suspense>
                    </Box>
                  </motion.div>
                }
              />
              <Route path="/products" element={<Products />} />
            </Routes>
          </MainContent>
        </Suspense>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;

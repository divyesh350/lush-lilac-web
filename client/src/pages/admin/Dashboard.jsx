import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RiDashboardLine, RiShoppingBag3Line, RiArtboard2Line, 
         RiMailLine, RiUserLine, RiMoneyDollarCircleLine, 
         RiSettings4Line, RiBarChart2Line } from 'react-icons/ri';
import adminTheme from '../../theme/adminTheme';

// Lazy loaded components
const Sidebar = lazy(() => import('../../components/layout/admin/Sidebar'));
const Header = lazy(() => import('../../components/layout/admin/Header'));
const AnalyticsOverview = lazy(() => import('../../components/layout/admin/AnalyticsOverview'));
const RecentOrders = lazy(() => import('../../components/layout/admin/RecentOrders'));
const TopProducts = lazy(() => import('../../components/layout/admin/TopProducts'));

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

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <Suspense fallback={<CircularProgress />}>
                  <AnalyticsOverview />
                </Suspense>
              </Box>

              <Box sx={{ mt: 4, display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                <Suspense fallback={<CircularProgress />}>
                  <RecentOrders />
                  <TopProducts />
                </Suspense>
              </Box>
            </motion.div>
          </MainContent>
        </Suspense>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;

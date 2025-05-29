import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  styled,
} from '@mui/material';
import {
  RiDashboardLine,
  RiShoppingBag3Line,
  RiArtboard2Line,
  RiMailLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiSettings4Line,
  RiBarChart2Line,
} from 'react-icons/ri';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '280px',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  zIndex: 1000,
  transition: theme.transitions.create('transform', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  display: 'flex',
  flexDirection: 'column',
}));

const Logo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: '64px',
}));

const StyledList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '4px',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  padding: theme.spacing(1, 1.5),
  minHeight: '48px',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: active ? 600 : 400,
  },
}));

const menuItems = [
  { title: 'Dashboard', icon: RiDashboardLine, path: '/admin' },
  { title: 'Products', icon: RiShoppingBag3Line, path: '/admin/products' },
  { title: 'Orders', icon: RiMoneyDollarCircleLine, path: '/admin/orders' },
  { title: 'Artwork', icon: RiArtboard2Line, path: '/admin/artwork' },
  { title: 'Newsletter', icon: RiMailLine, path: '/admin/newsletter' },
  { title: 'Users', icon: RiUserLine, path: '/admin/users' },
  { title: 'Analytics', icon: RiBarChart2Line, path: '/admin/analytics' },
  { title: 'Settings', icon: RiSettings4Line, path: '/admin/settings' },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <SidebarContainer>
        <Logo>
        <Link
              to="/"
            className="font-pacifico text-2xl text-primary hover:text-primary/80 transition-colors"
            >
              Lush Lilac
            </Link>
        </Logo>
        <Divider />
        <StyledList>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <StyledListItem
                key={item.title}
                component="div"
                active={isActive ? 1 : 0}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: isActive ? 'inherit' : 'primary.main' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </StyledListItem>
            );
          })}
        </StyledList>
      </SidebarContainer>
    </motion.div>
  );
};

export default Sidebar; 
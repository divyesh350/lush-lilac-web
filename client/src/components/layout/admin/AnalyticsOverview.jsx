import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import {
  RiShoppingBag3Line,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiBarChart2Line,
} from 'react-icons/ri';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  padding: theme.spacing(1),
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color,
  color: theme.palette.common.white,
}));

const metrics = [
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+12.5%',
    icon: RiShoppingBag3Line,
    color: '#4CAF50',
  },
  {
    title: 'Total Revenue',
    value: '$45,678',
    change: '+8.2%',
    icon: RiMoneyDollarCircleLine,
    color: '#2196F3',
  },
  {
    title: 'Total Customers',
    value: '892',
    change: '+5.7%',
    icon: RiUserLine,
    color: '#FF9800',
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '+2.1%',
    icon: RiBarChart2Line,
    color: '#9C27B0',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const AnalyticsOverview = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className='mt-4'
    >
      <Grid 
        container 
        spacing={4} 
        sx={{ 
          justifyContent: 'space-between',
          '& > .MuiGrid-item': {
            flexBasis: 'calc(25% - 24px)',
            maxWidth: 'calc(25% - 24px)',
            minWidth: '280px',
          }
        }}
      >
        {metrics.map((metric, index) => (
          <Grid
            key={index}
            item
          >
            <motion.div variants={itemVariants}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconWrapper color={metric.color}>
                      <metric.icon size={28} />
                    </IconWrapper>
                    <Box sx={{ ml: 2.5 }}>
                      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                        {metric.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: metric.change.startsWith('+') ? 'success.main' : 'error.main',
                      fontWeight: 500,
                    }}
                  >
                    {metric.change} from last month
                  </Typography>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default AnalyticsOverview; 
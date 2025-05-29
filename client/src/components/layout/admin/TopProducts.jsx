import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  LinearProgress,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: value > 70 ? theme.palette.success.main :
                    value > 40 ? theme.palette.info.main :
                    theme.palette.warning.main,
  },
}));

const topProducts = [
  {
    id: 1,
    name: 'Floral Print Dress',
    sales: 245,
    revenue: '$12,250',
    image: '/products/dress1.jpg',
    progress: 85,
  },
  {
    id: 2,
    name: 'Summer Collection T-Shirt',
    sales: 189,
    revenue: '$3,780',
    image: '/products/tshirt1.jpg',
    progress: 65,
  },
  {
    id: 3,
    name: 'Designer Handbag',
    sales: 156,
    revenue: '$15,600',
    image: '/products/bag1.jpg',
    progress: 45,
  },
  {
    id: 4,
    name: 'Leather Boots',
    sales: 132,
    revenue: '$7,920',
    image: '/products/boots1.jpg',
    progress: 35,
  },
  {
    id: 5,
    name: 'Sunglasses',
    sales: 98,
    revenue: '$1,960',
    image: '/products/sunglasses1.jpg',
    progress: 25,
  },
];

const TopProducts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledCard>
        <CardHeader title="Top Selling Products" />
        <CardContent>
          <List>
            {topProducts.map((product) => (
              <ListItem
                key={product.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={product.image}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <Box 
                        component="span"
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          width: '100%',
                          color: 'text.secondary'
                        }}
                      >
                        <Typography component="span" variant="body2">
                          {product.sales} sales
                        </Typography>
                        <Typography component="span" variant="body2" color="primary">
                          {product.revenue}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <StyledLinearProgress
                    variant="determinate"
                    value={product.progress}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default TopProducts; 
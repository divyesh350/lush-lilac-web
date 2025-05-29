import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import { RiMore2Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    pending: theme.palette.warning.main,
    processing: theme.palette.info.main,
    completed: theme.palette.success.main,
    cancelled: theme.palette.error.main,
  };

  return {
    backgroundColor: statusColors[status],
    color: theme.palette.common.white,
    fontWeight: 500,
  };
});

const recentOrders = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    date: '2024-03-15',
    amount: '$299.99',
    status: 'pending',
    items: 3,
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    date: '2024-03-15',
    amount: '$199.99',
    status: 'processing',
    items: 2,
  },
  {
    id: '#ORD-003',
    customer: 'Mike Johnson',
    date: '2024-03-14',
    amount: '$499.99',
    status: 'completed',
    items: 5,
  },
  {
    id: '#ORD-004',
    customer: 'Sarah Wilson',
    date: '2024-03-14',
    amount: '$149.99',
    status: 'cancelled',
    items: 1,
  },
  {
    id: '#ORD-005',
    customer: 'David Brown',
    date: '2024-03-13',
    amount: '$399.99',
    status: 'completed',
    items: 4,
  },
];

const RecentOrders = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledCard>
        <CardHeader
          title="Recent Orders"
          action={
            <IconButton aria-label="settings">
              <RiMore2Line />
            </IconButton>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <StatusChip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        status={order.status}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default RecentOrders; 
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import useAnalyticsStore from '../../store/analyticsStore';
import { RiShoppingBagLine, RiUserLine, RiShoppingCartLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const {
    orderCount,
    customerCount,
    productCount,
    revenue,
    topProducts,
    isLoading,
    error,
    fetchAnalytics,
    formatCurrency,
    getDailyChartData,
    getMonthlyChartData,
  } = useAnalyticsStore();

  const [chartData, setChartData] = useState({
    daily: null,
    monthly: null
  });

  useEffect(() => {
    fetchAnalytics();
    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  useEffect(() => {
    if (!isLoading) {
      const dailyData = getDailyChartData();
      const monthlyData = getMonthlyChartData();

      // Enhance daily chart data
      if (dailyData) {
        dailyData.datasets[0] = {
          ...dailyData.datasets[0],
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      }

      // Enhance monthly chart data
      if (monthlyData) {
        monthlyData.datasets[0] = {
          ...monthlyData.datasets[0],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      }

      setChartData({
        daily: dailyData,
        monthly: monthlyData
      });
    }
  }, [isLoading, getDailyChartData, getMonthlyChartData]);

  const stats = [
    {
      title: 'Total Orders',
      value: orderCount,
      icon: RiShoppingBagLine,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: customerCount,
      icon: RiUserLine,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: productCount,
      icon: RiShoppingCartLine,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(revenue),
      icon: RiMoneyDollarCircleLine,
      color: 'bg-yellow-500',
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          },
          title: function(context) {
            return context[0].label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6B7280'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6B7280'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Daily Revenue</h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-[300px]">
            {chartData.daily && (
              <Line
                data={chartData.daily}
                options={chartOptions}
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Revenue</h3>
            <span className="text-sm text-gray-500">Last 12 months</span>
          </div>
          <div className="h-[300px]">
            {chartData.monthly && (
              <Line
                data={chartData.monthly}
                options={chartOptions}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product._id}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{product._id}</p>
                  <p className="text-sm text-gray-500">Sold: {product.totalSold}</p>
                </div>
              </div>
              <p className="font-semibold">{formatCurrency(product.revenue)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RiShoppingBagLine, RiUserLine, RiMoneyDollarCircleLine, RiTimeLine, RiArrowUpLine } from 'react-icons/ri';
import * as echarts from 'echarts';

const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full">
        <Icon className="text-primary text-xl" />
      </div>
      <span className={`text-sm flex items-center ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        <RiArrowUpLine className="mr-1" />
        {change}%
      </span>
    </div>
    <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#FDF4FF',
        borderWidth: 1,
        textStyle: {
          color: '#1f2937'
        }
      },
      legend: {
        data: ['Sales'],
        right: 0,
        top: 0,
        textStyle: {
          color: '#1f2937'
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
          lineStyle: {
            color: '#E2E8F0'
          }
        },
        axisLabel: {
          color: '#1f2937'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#EDF2F7'
          }
        },
        axisLabel: {
          color: '#1f2937'
        }
      },
      series: [{
        name: 'Sales',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 3,
          color: '#9F7AEA'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(159, 122, 234, 0.2)' },
            { offset: 1, color: 'rgba(159, 122, 234, 0.02)' }
          ])
        },
        data: [4200, 5800, 5200, 6800, 7400, 6900, 7800]
      }]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={RiShoppingBagLine}
          title="Total Orders"
          value="1,482"
          change="12.5"
          changeType="up"
        />
        <StatCard
          icon={RiUserLine}
          title="Total Customers"
          value="892"
          change="8.2"
          changeType="up"
        />
        <StatCard
          icon={RiMoneyDollarCircleLine}
          title="Total Revenue"
          value="₹269.00K"
          change="15.3"
          changeType="up"
        />
        <StatCard
          icon={RiTimeLine}
          title="Pending Orders"
          value="56"
          change="3.8"
          changeType="down"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
          <div className="flex bg-gray-100 rounded-full p-1">
            <button className="px-4 py-1 rounded-full bg-primary text-white text-sm">Week</button>
            <button className="px-4 py-1 rounded-full text-gray-600 text-sm">Month</button>
            <button className="px-4 py-1 rounded-full text-gray-600 text-sm">Year</button>
          </div>
        </div>
        <div ref={chartRef} className="w-full h-64"></div>
      </div>
    </div>
  );
};

export default Dashboard; 
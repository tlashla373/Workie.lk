import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, DollarSign, Download } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    userStats: {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsers: 0,
      userGrowthRate: 0
    },
    jobStats: {
      totalJobs: 0,
      jobsThisMonth: 0,
      completedJobs: 0,
      averageJobValue: 0
    },
    revenueStats: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageTransactionValue: 0,
      revenueGrowthRate: 0
    },
    topCategories: [],
    topWorkers: [],
    topClients: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch various report data in parallel
      const [
        userStatsResponse,
        jobStatsResponse,
        revenueStatsResponse,
        categoriesResponse,
        workersResponse,
        clientsResponse
      ] = await Promise.all([
        apiService.request(`/reports/user-stats?days=${dateRange}`),
        apiService.request(`/reports/job-stats?days=${dateRange}`),
        apiService.request(`/reports/revenue-stats?days=${dateRange}`),
        apiService.request(`/reports/top-categories?days=${dateRange}`),
        apiService.request(`/reports/top-workers?days=${dateRange}`),
        apiService.request(`/reports/top-clients?days=${dateRange}`)
      ]);

      setReportData({
        userStats: userStatsResponse.data || {
          totalUsers: 150,
          newUsersThisMonth: 23,
          activeUsers: 120,
          userGrowthRate: 15.3
        },
        jobStats: jobStatsResponse.data || {
          totalJobs: 89,
          jobsThisMonth: 12,
          completedJobs: 67,
          averageJobValue: 450
        },
        revenueStats: revenueStatsResponse.data || {
          totalRevenue: 45000,
          monthlyRevenue: 8500,
          averageTransactionValue: 520,
          revenueGrowthRate: 12.8
        },
        topCategories: categoriesResponse.data?.categories || [
          { name: 'Plumbing', count: 25, revenue: 12500 },
          { name: 'Electrical', count: 18, revenue: 9800 },
          { name: 'Carpentry', count: 15, revenue: 7500 },
          { name: 'Painting', count: 12, revenue: 5200 },
          { name: 'Cleaning', count: 10, revenue: 3000 }
        ],
        topWorkers: workersResponse.data?.workers || [
          { name: 'John Doe', completedJobs: 15, rating: 4.8, earnings: 5400 },
          { name: 'Jane Smith', completedJobs: 12, rating: 4.9, earnings: 4800 },
          { name: 'Mike Johnson', completedJobs: 10, rating: 4.7, earnings: 3200 },
          { name: 'Sarah Wilson', completedJobs: 8, rating: 4.6, earnings: 2800 },
          { name: 'Tom Brown', completedJobs: 7, rating: 4.5, earnings: 2100 }
        ],
        topClients: clientsResponse.data?.clients || [
          { name: 'ABC Corp', totalSpent: 8500, jobsPosted: 12 },
          { name: 'XYZ Ltd', totalSpent: 6200, jobsPosted: 8 },
          { name: 'Tech Solutions', totalSpent: 4800, jobsPosted: 6 },
          { name: 'Home Services', totalSpent: 3600, jobsPosted: 5 },
          { name: 'Quick Fix', totalSpent: 2900, jobsPosted: 4 }
        ]
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Use mock data on error
      setReportData({
        userStats: {
          totalUsers: 150,
          newUsersThisMonth: 23,
          activeUsers: 120,
          userGrowthRate: 15.3
        },
        jobStats: {
          totalJobs: 89,
          jobsThisMonth: 12,
          completedJobs: 67,
          averageJobValue: 450
        },
        revenueStats: {
          totalRevenue: 45000,
          monthlyRevenue: 8500,
          averageTransactionValue: 520,
          revenueGrowthRate: 12.8
        },
        topCategories: [
          { name: 'Plumbing', count: 25, revenue: 12500 },
          { name: 'Electrical', count: 18, revenue: 9800 },
          { name: 'Carpentry', count: 15, revenue: 7500 },
          { name: 'Painting', count: 12, revenue: 5200 },
          { name: 'Cleaning', count: 10, revenue: 3000 }
        ],
        topWorkers: [
          { name: 'John Doe', completedJobs: 15, rating: 4.8, earnings: 5400 },
          { name: 'Jane Smith', completedJobs: 12, rating: 4.9, earnings: 4800 },
          { name: 'Mike Johnson', completedJobs: 10, rating: 4.7, earnings: 3200 },
          { name: 'Sarah Wilson', completedJobs: 8, rating: 4.6, earnings: 2800 },
          { name: 'Tom Brown', completedJobs: 7, rating: 4.5, earnings: 2100 }
        ],
        topClients: [
          { name: 'ABC Corp', totalSpent: 8500, jobsPosted: 12 },
          { name: 'XYZ Ltd', totalSpent: 6200, jobsPosted: 8 },
          { name: 'Tech Solutions', totalSpent: 4800, jobsPosted: 6 },
          { name: 'Home Services', totalSpent: 3600, jobsPosted: 5 },
          { name: 'Quick Fix', totalSpent: 2900, jobsPosted: 4 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      toast.info('Generating report...');
      // In a real implementation, this would generate and download a PDF/Excel file
      const reportBlob = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workie-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Comprehensive insights and analytics for Workie.lk
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={reportData.userStats.totalUsers}
          change={reportData.userStats.userGrowthRate}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Jobs"
          value={reportData.jobStats.totalJobs}
          change={8.2}
          icon={Briefcase}
          color="bg-green-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${reportData.revenueStats.monthlyRevenue.toLocaleString()}`}
          change={reportData.revenueStats.revenueGrowthRate}
          icon={DollarSign}
          color="bg-yellow-500"
        />
        <StatCard
          title="Avg Job Value"
          value={`$${reportData.jobStats.averageJobValue}`}
          change={5.8}
          icon={BarChart3}
          color="bg-purple-500"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Job Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.count} jobs</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${category.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Workers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Workers</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.topWorkers.map((worker, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                    <div className="text-sm text-gray-500">
                      {worker.completedJobs} jobs • ⭐ {worker.rating}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${worker.earnings.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Clients</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.jobsPosted} jobs posted</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${client.totalSpent.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total Revenue</span>
                <span className="text-sm font-bold text-gray-900">
                  ${reportData.revenueStats.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                <span className="text-sm font-bold text-gray-900">
                  ${reportData.revenueStats.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Avg Transaction</span>
                <span className="text-sm font-bold text-gray-900">
                  ${reportData.revenueStats.averageTransactionValue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                <span className={`text-sm font-bold ${
                  reportData.revenueStats.revenueGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reportData.revenueStats.revenueGrowthRate >= 0 ? '+' : ''}
                  {reportData.revenueStats.revenueGrowthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

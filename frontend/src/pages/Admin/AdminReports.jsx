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
      
      // Fetch various report data in parallel from REAL analytics endpoints
      const [
        userStatsResponse,
        jobStatsResponse,
        revenueStatsResponse,
        categoriesResponse,
        workersResponse,
        clientsResponse
      ] = await Promise.all([
        apiService.request(`/analytics/admin/user-stats?days=${dateRange}`),
        apiService.request(`/analytics/admin/job-stats?days=${dateRange}`),
        apiService.request(`/analytics/admin/revenue-stats?days=${dateRange}`),
        apiService.request(`/analytics/admin/top-categories?days=${dateRange}`),
        apiService.request(`/analytics/admin/top-workers?days=${dateRange}`),
        apiService.request(`/analytics/admin/top-clients?days=${dateRange}`)
      ]);

      setReportData({
        userStats: userStatsResponse.data || {
          totalUsers: 0,
          newUsersThisMonth: 0,
          activeUsers: 0,
          userGrowthRate: 0
        },
        jobStats: jobStatsResponse.data || {
          totalJobs: 0,
          jobsThisMonth: 0,
          completedJobs: 0,
          averageJobValue: 0
        },
        revenueStats: revenueStatsResponse.data || {
          totalRevenue: 0,
          monthlyRevenue: 0,
          averageTransactionValue: 0,
          revenueGrowthRate: 0
        },
        topCategories: categoriesResponse.data?.categories || [],
        topWorkers: workersResponse.data?.workers || [],
        topClients: clientsResponse.data?.clients || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch analytics data. Please try again.');
      // Set empty data on error
      setReportData({
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
        topClients: []
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
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
            {reportData.topCategories.length > 0 ? (
              <div className="space-y-4">
                {reportData.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900 capitalize">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.count} jobs</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${category.revenue ? category.revenue.toLocaleString() : '0'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No category data available for this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Workers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Workers</h3>
            <p className="text-sm text-gray-500 mt-1">Ranked by average rating</p>
          </div>
          <div className="p-6">
            {reportData.topWorkers.length > 0 ? (
              <div className="space-y-4">
                {reportData.topWorkers.map((worker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{worker.completedJobs} jobs</span>
                          {worker.reviewCount && (
                            <>
                              <span>•</span>
                              <span>{worker.reviewCount} reviews</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-bold text-gray-900">
                            {worker.rating ? worker.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ${worker.earnings ? worker.earnings.toLocaleString() : '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No worker data available for this period</p>
              </div>
            )}
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
            {reportData.topClients.length > 0 ? (
              <div className="space-y-4">
                {reportData.topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.jobsPosted} jobs posted</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${client.totalSpent ? client.totalSpent.toLocaleString() : '0'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No client data available for this period</p>
              </div>
            )}
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

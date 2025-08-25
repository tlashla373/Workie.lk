import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import apiService from '../../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalClients: 0,
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    pendingApplications: 0,
    totalApplications: 0,
    monthlyRevenue: 0,
    recentUsers: [],
    recentJobs: [],
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch various statistics in parallel
      const [usersResponse, jobsResponse, applicationsResponse] = await Promise.all([
        apiService.request('/users/stats/overview'),
        apiService.request('/jobs/stats/overview'),
        apiService.request('/applications/stats/overview')
      ]);

      // Fetch recent data
      const [recentUsersResponse, recentJobsResponse, recentAppsResponse] = await Promise.all([
        apiService.request('/users?limit=5&sort=-createdAt'),
        apiService.request('/jobs?limit=5&sort=-createdAt'),
        apiService.request('/applications?limit=5&sort=-createdAt')
      ]);

      setStats({
        totalUsers: usersResponse.data?.totalUsers || 0,
        totalWorkers: usersResponse.data?.totalWorkers || 0,
        totalClients: usersResponse.data?.totalClients || 0,
        totalJobs: jobsResponse.data?.totalJobs || 0,
        activeJobs: jobsResponse.data?.activeJobs || 0,
        completedJobs: jobsResponse.data?.completedJobs || 0,
        pendingApplications: applicationsResponse.data?.pendingApplications || 0,
        totalApplications: applicationsResponse.data?.totalApplications || 0,
        monthlyRevenue: jobsResponse.data?.monthlyRevenue || 0,
        recentUsers: recentUsersResponse.data?.users || [],
        recentJobs: recentJobsResponse.data?.jobs || [],
        recentApplications: recentAppsResponse.data?.applications || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
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
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to the Workie.lk admin dashboard
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="bg-purple-500"
          change={-3}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
          change={15}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workers"
          value={stats.totalWorkers}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatCard
          title="Clients"
          value={stats.totalClients}
          icon={Users}
          color="bg-pink-500"
        />
        <StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent users</p>
              ) : (
                stats.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.userType}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentJobs.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent jobs</p>
              ) : (
                stats.recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-500">{job.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentApplications.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent applications</p>
              ) : (
                stats.recentApplications.map((application) => (
                  <div key={application._id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Application #{application._id?.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">{application.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

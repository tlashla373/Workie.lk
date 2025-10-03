import { useState, useEffect } from 'react';
import { Send, Eye, Trash2, Users, AlertCircle } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/notifications/admin');
      setNotifications(response.data?.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data
      setNotifications([
        {
          _id: '1',
          title: 'Welcome to Workie.lk',
          message: 'Thank you for joining our platform. Start finding great opportunities today!',
          type: 'info',
          createdAt: new Date().toISOString(),
          recipients: 45,
          readCount: 32
        },
        {
          _id: '2',
          title: 'System Maintenance',
          message: 'Our platform will undergo maintenance tonight from 2 AM to 4 AM.',
          type: 'warning',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          recipients: 150,
          readCount: 120
        },
        {
          _id: '3',
          title: 'New Feature Update',
          message: 'We have added video calling feature for better communication between clients and workers.',
          type: 'success',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          recipients: 150,
          readCount: 98
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    try {
      if (!newNotification.title || !newNotification.message) {
        toast.error('Please fill in all required fields');
        return;
      }

      await apiService.request('/notifications/admin/create', {
        method: 'POST',
        body: newNotification
      });

      toast.success('Notification sent successfully');
      setShowCreateModal(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await apiService.request(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const CreateNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Notification</h3>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification message..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <select
              value={newNotification.targetAudience}
              onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="workers">Workers Only</option>
              <option value="clients">Clients Only</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateNotification}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Notification Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Send and manage system notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Send className="w-4 h-4 mr-2" />
          Create Notification
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new notification.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 max-w-3xl">
                        {notification.message}
                      </p>
                      
                      <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {notification.recipients || 0} recipients
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {notification.readCount || 0} read
                        </div>
                        <div>
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Read Rate Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Read Rate</span>
                      <span>
                        {notification.recipients > 0 
                          ? Math.round((notification.readCount / notification.recipients) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: notification.recipients > 0 
                            ? `${(notification.readCount / notification.recipients) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && <CreateNotificationModal />}
    </div>
  );
};

export default AdminNotifications;

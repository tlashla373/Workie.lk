import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationTest = () => {
  const { 
    notifications, 
    unreadCount, 
    createTestNotification, 
    isConnected,
    markAsRead,
    deleteNotification,
    clearAllNotifications 
  } = useNotifications();

  const handleCreateTest = (type) => {
    createTestNotification(type);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Real-time Notification System Test</h2>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
            <span className="text-sm text-gray-600">
              Unread: <strong>{unreadCount}</strong> | Total: <strong>{notifications.length}</strong>
            </span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Test Notification Types</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleCreateTest('system')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              System Notification
            </button>
            <button 
              onClick={() => handleCreateTest('job_application')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Job Application
            </button>
            <button 
              onClick={() => handleCreateTest('message')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Message
            </button>
            <button 
              onClick={clearAllNotifications}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div>
          <h3 className="font-semibold mb-3">Recent Notifications ({notifications.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications yet. Create some test notifications above!</p>
            ) : (
              notifications.slice(0, 10).map((notification, index) => (
                <div 
                  key={notification.id || index} 
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function getNotificationIcon(type) {
    switch (type) {
      case 'job_application': return '💼';
      case 'job_posted': return '📝';
      case 'message': return '💬';
      case 'connection': return '👥';
      case 'review': return '⭐';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }
};

export default NotificationTest;
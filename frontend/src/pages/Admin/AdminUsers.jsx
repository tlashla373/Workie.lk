import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MoreVertical, Eye, UserX, UserCheck, Edit } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 5,
        search: debouncedSearchTerm,
        userType: filterType !== 'all' ? filterType : ''
      });

      const response = await apiService.request(`/users?${queryParams}`);
      
      setUsers(response.data?.users || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterType, debouncedSearchTerm]);

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, debouncedSearchTerm]);

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserAction = async (userId, action) => {
    try {
      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'activate':
        case 'deactivate':
          endpoint = `/admin/users/${userId}/activate`;
          message = `User ${action}d successfully`;
          break;
        case 'delete':
          endpoint = `/admin/users/${userId}`;
          message = 'User deleted successfully';
          break;
        default:
          return;
      }

      await apiService.request(endpoint, { 
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast.success(message);
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await apiService.request(`/users/${userId}`);
      setSelectedUser(response.data?.user);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    }
  };

  const UserModal = () => {
    if (!selectedUser) return null;

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatAddress = (address) => {
      if (!address) return 'N/A';
      const parts = [
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.country
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'N/A';
    };

    return (
      <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white">
                {(selectedUser.profilePicture || selectedUser.profile?.profilePicture || selectedUser.avatar) ? (
                  <img
                    src={selectedUser.profilePicture || selectedUser.profile?.profilePicture || selectedUser.avatar}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p className="text-blue-100 text-sm">{selectedUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto no-scrollbar flex-1 p-6">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                selectedUser.isActive 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  selectedUser.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {selectedUser.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                selectedUser.userType === 'worker'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : selectedUser.userType === 'client'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {selectedUser.userType?.toUpperCase()}
              </span>
              {selectedUser.isVerified && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
              {selectedUser.isEmailVerified && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Verified
                </span>
              )}
            </div>

            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <p className="text-base text-gray-900 font-medium break-all">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-base text-gray-900 font-medium">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            {selectedUser.address && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Information
                </h3>
                <div className="space-y-1">
                  <p className="text-base text-gray-900">{formatAddress(selectedUser.address)}</p>
                </div>
              </div>
            )}

            {/* Account Details Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded border">
                    {selectedUser._id}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Created</label>
                  <p className="text-base text-gray-900 font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</label>
                  <p className="text-base text-gray-900 font-medium">{formatDate(selectedUser.updatedAt)}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</label>
                  <p className="text-base text-gray-900 font-medium">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
            </div>

            {/* Profile Pictures & Verification Documents Section */}
            {(selectedUser.profilePicture || selectedUser.coverPhoto || (selectedUser.userType === 'worker' && selectedUser.verificationDocuments)) && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Media & Verification Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedUser.profilePicture && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Picture</label>
                      <div className="relative aspect-square w-full max-w-xs mx-auto bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img 
                          src={selectedUser.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => { setSelectedImage(selectedUser.profilePicture); setShowImageModal(true); }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedUser.coverPhoto && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Photo</label>
                      <div className="relative aspect-video w-full max-w-xs mx-auto bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img 
                          src={selectedUser.coverPhoto} 
                          alt="Cover" 
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => { setSelectedImage(selectedUser.coverPhoto); setShowImageModal(true); }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Show ID photos only for workers */}
                  {selectedUser.userType === 'worker' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification ID Photos</label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedUser.verificationDocuments?.idPhotoFront ? (
                          <div className="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={() => { setSelectedImage(selectedUser.verificationDocuments.idPhotoFront); setShowImageModal(true); }}>
                            <img
                              src={selectedUser.verificationDocuments.idPhotoFront}
                              alt="ID Front"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-square w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">No front ID</div>
                        )}

                        {selectedUser.verificationDocuments?.idPhotoBack ? (
                          <div className="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={() => { setSelectedImage(selectedUser.verificationDocuments.idPhotoBack); setShowImageModal(true); }}>
                            <img
                              src={selectedUser.verificationDocuments.idPhotoBack}
                              alt="ID Back"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-square w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">No back ID</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              onClick={() => setShowUserModal(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Image modal (lightbox)
  const ImageModal = () => {
    if (!showImageModal || !selectedImage) return null;
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70" onClick={() => { setShowImageModal(false); setSelectedImage(null); }}>
        <div className="relative max-w-4xl w-full mx-4">
          <button onClick={(e) => { e.stopPropagation(); setShowImageModal(false); setSelectedImage(null); }} className="absolute right-2 top-2 z-70 bg-white rounded-full p-2 shadow">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={selectedImage} alt="Enlarged" className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ImageModal />
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all users in the system
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="worker">Workers</option>
            <option value="client">Clients</option>
          </select>
          
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-700">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.userType === 'worker' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewUserDetails(user._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {user.isActive ? (
                            <button
                              onClick={() => handleUserAction(user._id, 'deactivate')}
                              className="text-red-600 hover:text-red-900"
                              title="Deactivate User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user._id, 'activate')}
                              className="text-green-600 hover:text-green-900"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && <UserModal />}
    </div>
  );
};

export default AdminUsers;

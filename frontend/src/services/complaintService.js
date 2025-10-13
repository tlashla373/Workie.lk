import apiService from './apiService';

const complaintService = {
    // Submit a new complaint/report
    submitComplaint: async (complaintData) => {
        try {
            const response = await apiService.request('/complaints', {
                method: 'POST',
                body: complaintData
            });
            return response;
        } catch (error) {
            console.error('Error submitting complaint:', error);
            throw error;
        }
    },

    // Get user's complaints
    getUserComplaints: async (page = 1, limit = 10, status = 'all') => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (status !== 'all') {
                params.append('status', status);
            }

            const response = await apiService.request(`/complaints?${params}`);
            return response;
        } catch (error) {
            console.error('Error fetching complaints:', error);
            throw error;
        }
    },

    // Get complaint details
    getComplaintDetails: async (complaintId) => {
        try {
            const response = await apiService.request(`/complaints/${complaintId}`);
            return response;
        } catch (error) {
            console.error('Error fetching complaint details:', error);
            throw error;
        }
    },

    // Update complaint (add evidence or notes)
    updateComplaint: async (complaintId, updateData) => {
        try {
            const response = await apiService.request(`/complaints/${complaintId}`, {
                method: 'PUT',
                body: updateData
            });
            return response;
        } catch (error) {
            console.error('Error updating complaint:', error);
            throw error;
        }
    },

    // Withdraw/cancel complaint
    withdrawComplaint: async (complaintId) => {
        try {
            const response = await apiService.request(`/complaints/${complaintId}`, {
                method: 'DELETE'
            });
            return response;
        } catch (error) {
            console.error('Error withdrawing complaint:', error);
            throw error;
        }
    },

    // Admin: Get all complaints
    adminGetComplaints: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key] !== 'all') {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiService.request(`/admin/complaints?${params}`);
            return response;
        } catch (error) {
            console.error('Error fetching admin complaints:', error);
            throw error;
        }
    },

    // Admin: Update complaint status
    adminUpdateComplaintStatus: async (complaintId, status, adminNote = '') => {
        try {
            const response = await apiService.request(`/admin/complaints/${complaintId}/status`, {
                method: 'PUT',
                body: { status, adminNote }
            });
            return response;
        } catch (error) {
            console.error('Error updating complaint status:', error);
            throw error;
        }
    },

    // Admin: Resolve complaint
    adminResolveComplaint: async (complaintId, action, details = '') => {
        try {
            const response = await apiService.request(`/admin/complaints/${complaintId}/resolve`, {
                method: 'PUT',
                body: { action, details }
            });
            return response;
        } catch (error) {
            console.error('Error resolving complaint:', error);
            throw error;
        }
    },

    // Admin: Assign complaint
    adminAssignComplaint: async (complaintId, adminId) => {
        try {
            const response = await apiService.request(`/admin/complaints/${complaintId}/assign`, {
                method: 'PUT',
                body: { adminId }
            });
            return response;
        } catch (error) {
            console.error('Error assigning complaint:', error);
            throw error;
        }
    },

    // Admin: Add note
    adminAddNote: async (complaintId, note) => {
        try {
            const response = await apiService.request(`/admin/complaints/${complaintId}/notes`, {
                method: 'POST',
                body: { note }
            });
            return response;
        } catch (error) {
            console.error('Error adding admin note:', error);
            throw error;
        }
    },

    // Admin: Get complaint details
    adminGetComplaintDetails: async (complaintId) => {
        try {
            const response = await apiService.request(`/admin/complaints/${complaintId}`);
            return response;
        } catch (error) {
            console.error('Error fetching admin complaint details:', error);
            throw error;
        }
    }
};

export default complaintService;
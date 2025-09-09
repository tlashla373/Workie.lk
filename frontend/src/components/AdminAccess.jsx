import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminAccess = () => {
  const { user } = useAuth();

  // Only show for admin users
  if (!user || user.userType !== 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to="/admin"
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
        title="Admin Dashboard"
      >
        <Shield className="w-5 h-5 mr-2" />
        Admin
      </Link>
    </div>
  );
};

export default AdminAccess;

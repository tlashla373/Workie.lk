import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  Home,
  Star,
  Bell,
  ShieldCheck,
  MessageSquareWarning,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Logo from '../../assets/Logo.png';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheck },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/loginpage');
  };

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        h-screen fixed inset-y-0 left-0 z-50 
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#4E6BF5] border-gray-200'} 
        shadow-lg transform transition-all duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:inset-0 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header - Fixed height */}
        <div className={`flex items-center justify-between h-16 px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Workie.LK" className="w-8 h-8 bg-white rounded-lg" />
            {!isCollapsed && (
              <span className="text-xl audiowide-regular font-bold text-white">Workie.LK</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse button for desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex text-gray-100 hover:text-gray-300 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-100 hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'} ${!isCollapsed ? 'border-r-4 border-blue-700' : ''}`
                        : `text-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} hover:text-gray-900`
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    title={isCollapsed ? item.name : ''}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button - Fixed at bottom */}
        <div className="flex-shrink-0 p-3">
          <button
            onClick={handleLogout}
            className={`
              flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 w-full 
              text-gray-100 hover:bg-red-400 rounded-lg transition-colors duration-200
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b h-16 flex items-center justify-between px-6 flex-shrink-0`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`text-2xl alatsi-regular font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

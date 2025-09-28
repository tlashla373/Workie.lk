import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import AppLayout from './pages/Profile/AppLayout';
import FindJobs from './pages/FindJobs/FindJobs';
import PostJob from './pages/JobPosting/PostJob';
import WorkHistory from './pages/WorkHistory/WorkHistory';
import Settings from './pages/Settings';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Video from './pages/Video/Video';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import LoginPage from './pages/Authentication/LoginPage';
import SignUpPage from './pages/Authentication/SignUpPage';
import EmailVerification from './pages/Authentication/EmailVerification';
import RoleSelection from './pages/Authentication/RoleSelection';
import Friends from './pages/Friend/Friends';
import WorkerVerification from './pages/Authentication/WorkerVerification';
import ClientSetup from './pages/Authentication/ClientSetup';
import AddPostPage from './pages/AddPostPage/AddPostPage';
import OTPPage from './pages/Authentication/OtpPage';
import ForgotPasswordPage from './pages/Authentication/ForgotPasswordPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobApplicationPage from './pages/JobApplicationPage/JobApplicationPage';
import JobProgressPage from './pages/WorkHistory/JobProgressPage';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminJobs from './pages/Admin/AdminJobs';
import AdminApplications from './pages/Admin/AdminApplications';
import AdminReviews from './pages/Admin/AdminReviews';
import AdminReports from './pages/Admin/AdminReports';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminSettings from './pages/Admin/AdminSettings';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import AdminRegistration from './components/AdminPanel/AdminRegistration';
import JobDetailsContainer from './pages/JobDetails/JobDetailsContainer';
import ProtectedRoute from './components/ProtectionPage/ProtectedRoute';
import PublicRoute from './components/ProtectionPage/PublicRoute';
import AdminRoute from './components/AdminPanel/AdminRoute';


const App = () => {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'findjobs',
          element: <FindJobs />,
        },
        {
          path: 'friends',
          element: <Friends />,
        },
        {
          path: 'clientprofile',
          element: <Profile />,
        },
        {
          path: 'workerprofile',
          element: <Profile />,
        },
        {
          path: 'profile/:userId',
          element: <Profile />,
        },
        {
          path: 'edit-profile',
          element: <EditProfile />,
        },
        {
          path: 'post-job',
          element: <PostJob />,
        },
        {
          path: 'workhistory',
          element: <WorkHistory/>,
        },
        {
          path: 'job-progress/:jobId',
          element: <JobProgressPage/>,
        },
        {
          path: 'video',
          element: <Video/>,
        },
        {
          path: 'add-post',
          element: <AddPostPage/>,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
        {
          path: 'job-application-page',
          element: <JobApplicationPage />,
        },
        {
          path: 'notifications',
          element: <NotificationsPage />,
        },
        {
          path: 'jobs/:id',
          element: <JobDetailsContainer />,
        },
      ],
    },
    {
      path: '/admin',
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: 'users',
          element: <AdminUsers />,
        },
        {
          path: 'jobs',
          element: <AdminJobs />,
        },
        {
          path: 'applications',
          element: <AdminApplications />,
        },
        {
          path: 'reviews',
          element: <AdminReviews />,
        },
        {
          path: 'reports',
          element: <AdminReports />,
        },
        {
          path: 'notifications',
          element: <AdminNotifications />,
        },
        {
          path: 'settings',
          element: <AdminSettings />,
        },
      ],
    },
    {
      path: '/loginpage',
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: '/signuppage',
      element: (
        <PublicRoute>
          <SignUpPage />
        </PublicRoute>
      ),
    },
    {
      path: '/email-verification',
      element: (
        <PublicRoute>
          <EmailVerification />
        </PublicRoute>
      ),
    },
    {
      path: '/roleselection',
      element: (
        <PublicRoute>
          <RoleSelection />
        </PublicRoute>
      ),
    },
    {
      path: '/workerverification',
      element: (
        <PublicRoute>
          <WorkerVerification />
        </PublicRoute>
      ),
    },
    {
      path: '/forgotpasswordpage',
      element: (
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      ),
    },
    {
      path: '/otppage',
      element: (
        <PublicRoute>
          <OTPPage />
        </PublicRoute>
      ),
    },
    {
      path: '/clientsetup',
      element: (
        <PublicRoute>
          <ClientSetup />
        </PublicRoute>
      ),
    },
    {
      path: '/admin-register',
      element: (
        <AdminRoute>
          <AdminRegistration />
        </AdminRoute>
      ),
    },
    {
      path: '*',
      element: (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-gray-400">404</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or you don't have permission to access it.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      ),
    }
  ]);

  return (
    <DarkModeProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </NotificationProvider>
    </DarkModeProvider>
  );
};

export default App;
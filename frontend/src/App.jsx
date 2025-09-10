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
import AdminRegistration from './components/AdminRegistration';


const App = () => {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout/>,
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
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
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
      element: <LoginPage/> ,
    },
    {
      path: '/signuppage',
      element: <SignUpPage/>,
    },
    {
      path: '/email-verification',
      element: <EmailVerification/>,
    },
    {
      path: '/roleselection',
      element: <RoleSelection/>,
    },
    {
      path: '/workerverification',
      element: <WorkerVerification/>,
    },
    {
      path: '/forgotpasswordpage',
      element: <ForgotPasswordPage/>,
    },
    {
      path: '/otppage',
      element: <OTPPage/>,
    },
    {
      path: '/clientsetup',
      element: <ClientSetup/>,
    },
    {
      path: '/admin-register',
      element: <AdminRegistration/>,
    }
  ]);

  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </DarkModeProvider>
  );
};

export default App;

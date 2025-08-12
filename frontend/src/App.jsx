import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import AppLayout from './pages/Profile/AppLayout';
import FindJobs from './pages/FindJobs/FindJobs';
import PostJob from './pages/JobPosting/PostJob';
import WorkHistory from './pages/WorkHistory/WorkHistory';
import Settings from './pages/Settings';
import WorkerProfile from './pages/Profile/WorkerProfile';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Video from './pages/Video/Video';
import ClientProfile from './pages/Profile/ClientProfile';
import LoginPage from './pages/Authentication/LoginPage';
import SignUpPage from './pages/Authentication/SignUpPage';
import RoleSelection from './pages/Authentication/RoleSelection';
import Friends from './pages/Friend/Friends';
import WorkerVerification from './pages/Authentication/WorkerVerificatio';
import ClientSetup from './pages/Authentication/ClientSetup';
import AddPostPage from './pages/AddPostPage/AddPostPage';

const App = () => {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
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
          element: <ClientProfile />,
        },
        {
          path: 'postjob',
          element: <PostJob />,
        },
        {
          path: 'workhistory',
          element: <WorkHistory />,
        },
        {
          path: 'video',
          element: <Video/>,
        },
        {
          path: 'addpost',
          element: <AddPostPage/>,
        },
        {
          path: 'settings',
          element: <Settings />,
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
      path: '/roleselection',
      element: <RoleSelection/>,
    },
    {
      path: '/workerverification',
      element: <WorkerVerification/>,
    },
    {
      path: '/clientsetup',
      element: <ClientSetup/>,
    },
    {
      path: '/workerprofile',
      element: <WorkerProfile />,
    }
  ]);

  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
};

export default App;

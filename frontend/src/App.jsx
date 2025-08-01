import { useState } from 'react'
import './App.css'
import { createBrowserRouter , RouterProvider} from 'react-router-dom';
import Home from './pages/HomePage/Home'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import AppLayout from './pages/Profile/AppLayout';
import FindJobs from './pages/FindJobs/findJobs';
import PostJob from './pages/JobPosting/postJob';
import WorkHistory from './pages/WorkHistory/WorkHistory';
import AuthForm from './pages/Authentication/AuthForm';
import { Settings } from 'lucide-react';
import WorkerProfile from './pages/Profile/WorkerProfile';

const App = () => {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter ([
    {
      path:"/",
      element: <AppLayout/>,
      children:[
        {
        index:true,
        element: <Home/>
        },
        {
          path:'findjobs',
          element:<FindJobs/>
        },
        {
          path:'postjob',
          element:<PostJob/>
        },
        {
          path:'workhistory',
          element:<WorkHistory/>
        },
        {
          path:'settings',
          element:<Settings/>
        },
      ],
    },
    {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/authform',
    element: <AuthForm />,
  },
  {
    path: '/workerprofile',
    element: <WorkerProfile />,
  },
  ]);

  return <RouterProvider router={router}/>
};

export default App;

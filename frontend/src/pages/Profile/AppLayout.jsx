import React from 'react';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <NavBar />
    </div>
  );
};

export default AppLayout;

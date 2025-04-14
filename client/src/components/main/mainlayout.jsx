import React from 'react';
import { Outlet } from 'react-router-dom';
import db from '../../assets/dbb.png'
import Header from '../../components/main/header';

function MainLayout() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${db}')` }} // Make sure the image is in your public folder
    > 
    <Header/>
      <Outlet />
    </div>
  );
}

export default MainLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import db from '../../assets/dbb.png'
import Header from '../../components/main/header';

function MainLayout() {
  return (
    <div
      // Make sure the image is in your public folder
    > 
    <Header/>
      <Outlet />
    </div>
  );
}

export default MainLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import bg4 from '../../assets/notes9.png';

const Authlayout = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <div className="min-h-screen flex justify-end items-center p-0  md:p-4">
        <div className="w-full sm:w-3/4 md:w-3/4 lg:w-1/2 p-0  md:p-8 rounded-xl ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Authlayout;

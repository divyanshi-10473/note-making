import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import bg4 from '../../assets/notes9.png';
import { Button } from '../ui/button';


const Authlayout = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <header>
      <div className="flex justify-end items-center px-6 pt-2 gap-5  right-2 fixed">
                    <Button variant="outline" className="text-black border-white hover:bg-white/70 " onClick={() => navigate('/auth/login')}>
                      Login
                    </Button>
                    <Button className="bg-white text-black hover:bg-black/10" onClick={() => navigate('/auth/register')}>
                      Sign Up
                    </Button>
                  </div>
      </header>
     
      <div className="min-h-screen flex  justify-end items-center p-0  md:p-4">
         
        <div className="w-full sm:w-3/4 md:w-3/4 lg:w-1/2 p-0  md:p-8 rounded-xl ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Authlayout;

import React from 'react';
import bg4 from '../../assets/notes9.png';
import logo from '../../assets/logo2.png'; // make sure to replace with your actual logo path
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <div className="min-h-screen bg-black/25 backdrop-blur-sm">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Notezy Logo" className="w-50 h-20 drop-shadow-[0_0_1px_rgba(0,0,0,1)]"/>
            
          </div>
          <div className="space-x-4 sm:flex hidden">
            <Button variant="outline" className="text-white border-white hover:bg-white/70 hover:text-black" onClick={() => navigate('/auth/login')}>
              Login
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200" onClick={() => navigate('/auth/register')}>
              Sign Up
            </Button>
          </div>
          <div className="sm:hidden">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="text-white cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded shadow-md p-2 space-y-2">
        <DropdownMenuItem
         onClick={() => navigate('/auth/login')}
          className="cursor-pointer bg-white text-black hover:bg-orange-100 p-2"
        >
          Login
        </DropdownMenuItem>
        <DropdownMenuItem
         onClick={() => navigate('/auth/register')}
          className="cursor-pointer bg-white text-black  hover:bg-orange-100 p-2"
        >
         Register
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

        </header>

        {/* Hero Section */}
        <main className="flex flex-col justify-center items-center px-6 md:px-24 h-[calc(100vh-80px)]">
          <div className="max-w-xl text-white flex flex-col justify-center items-center">
            <h2 className=" text-center text-4xl md:text-6xl font-bold mb-4">Welcome to Notezy</h2>
            <p className=" text-center text-lg md:text-xl mb-6">
              Organize your study materials, upload and create notes, and stay productive like never before.
            </p>
            <Button className="bg-white text-black text-lg px-6 py-2 hover:bg-gray-200 " onClick={() => navigate('/auth/login')}>
              Get Started
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import bgImg from '../../assets/login-Photoroom.png';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../store/auth-slice/index';
import { useToast } from '@/hooks/use-toast';


const AuthRegister = () => {

  const dispatch = useDispatch(); // Assuming you are using Redux for state management
  const navigate = useNavigate(); // Assuming you are using react-router-dom for navigation
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      toast({
        title: result.message,
        className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
      });
      navigate("/auth/login");
    } catch (errorMessage) {
      toast({
        title: errorMessage,
        variant: "destructive",
        className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
      });
    }
    
    
  };

  console.log('Form Data:', formData);

  return (
    <div className='flex flex-col justify-center items-center'>
      <img src={logo} alt="App Logo" className="h-20 w-60 my-4" />
      <div
        className="mx-auto w-full lg:h-[600px] h-full max-w-md space-y-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="pl-[20%] py-8 lg:py-14 h-full custom-padding">
          <h1 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Create new account
          </h1>
          <p className="text-center mb-4 lg:mb-20">
            Already have an account
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>

          <form className='h-[80%]' onSubmit={onSubmit}>
            <Label className="mb-1" htmlFor="username">User Name</Label>
            <Input
              placeholder="Enter your username"
              id="username"
              name="username"
              type="text"
              className="w-[85%]"
              value={formData.username }
              onChange={handleChange}
            />

            <Label className="mb-1" htmlFor="email">Email</Label>
            <Input
              placeholder="Enter your email"
              id="email"
              name="email"
              type="email"
              className="w-[85%]"
              value={formData.email } 
              onChange={handleChange}
            />

            <Label className="mb-1" htmlFor="password">Password</Label>
            <Input
              placeholder="Enter your password"
              id="password"
              name="password"
              type="password"
              className="w-[85%]"
              value={formData.password}
              onChange={handleChange}
            />

            <Button type="submit" className="w-[85%] bg-black text-purple-50 mt-6">
              Sign Up
            </Button>
          </form>
        </div>
      </div>

     
      <style>
        {`
          @media (max-width: 270px) {
            .custom-padding {
              padding-left: 7% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AuthRegister;

import { CircleUserRound, HousePlug, LogOut, Menu,  User,  UserCheck,  UserCog } from "lucide-react";
import {
  Link,
  useNavigate,
  
} from "react-router-dom";
import logo from '../../assets/logo.png'
import { Button } from '../ui/button';
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { logoutUser } from "../../../store/auth-slice/index";



function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  function handleLogout() {
    dispatch(logoutUser());
   
  }


  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 ">
     

      <DropdownMenu >
        <DropdownMenuTrigger asChild>
        <div className=" p-2 rounded-full cursor-pointer" style={{backgroundColor: "rgb(53, 41, 29)"}} >
  <User strokeWidth={2.25} color="white" size={30} />
</div>

        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 text-white border-2 border-white" style={{ background: " rgb(53, 41, 29)" }}>
          <DropdownMenuLabel>Logged in as {user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 hover:text-black" onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4 " />
            Account
          </DropdownMenuItem  >
          <DropdownMenuSeparator color="white" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-orange-50 hover:text-black" >
            <LogOut className="mr-2 h-4 w-4 " />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="fixed z-40 top-0  w-full shadow-xl " style={{ background: " rgba(248, 231, 212, 0.7)" ,borderBottom: "1px solid white" }}>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
        
          <img
  src={logo}
  alt="logo"
  className="w-[200px] rounded-md transition duration-300 hover:scale-105 "
  style={{
    filter: 'drop-shadow(5px 5px 20px rgba(168, 160, 160, 0.632))',
    
  }}
/>




        </Link>
        
       

        <div className="block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default Header;

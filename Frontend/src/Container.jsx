import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "./store/authSlice.js";
import axios from "axios";
import Sidebar, { SidebarItem } from "./components/Sidebar/Sidebar.jsx";
import {
  Users,
  HeartHandshake,
  History,  
  LayoutDashboard,
  Settings,
  HelpCircle,
} from "lucide-react";
import './axiosConfig';

const Container = ({ children }) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const items = [
    {
      text: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      link: "/admin",
    }, 
    {
      text: 'Donors',
      icon: <HeartHandshake size={20} />,
      link: "/donors",
    }, 
    {
      text: 'Recipients',
      icon: <Users size={20} />,
      link: "/recipients"
    }, 
    {
      text: 'Match History',
      icon: <History size={20} />,
      link: "/match-history"
    }, 
    {
      text: 'Settings',
      icon: <Settings size={20} />,
      link: "/settings"
    }, 
    {
      text: 'Help',
      icon: <HelpCircle size={20} />,
      link: "/#help"
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/v1/hospitals/current-hospital");
        if (response.data.success) {
          dispatch(login(response.data.data));
        } else {
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(logout());
        navigate("/login");
      }
    };

    if (!authStatus) {
      checkAuth();
    }
  }, [dispatch, navigate, authStatus]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {authStatus && (
        <div className="fixed left-0 top-0 h-full z-20">
          <Sidebar>
            {items.map((item, index) => (
              <div onClick={() => setActiveIndex(index)}>
                <SidebarItem 
                  key={index}
                  icon={item.icon} 
                  text={item.text}
                  link={item.link}
                  active={activeIndex === index}
                />
              </div>
            ))}
          </Sidebar>
        </div>
      )}
      <main className={`flex-1 overflow-auto ${authStatus ? "ml-[4.29rem]" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Container;
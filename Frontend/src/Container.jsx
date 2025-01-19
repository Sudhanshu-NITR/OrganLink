import React, { useEffect } from "react";
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

function Container({ children }) {
  const navigate = useNavigate();
  let authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/v1/hospitals/current-hospital");
        if (response.data.success) {
            const hospital = response.data.data;
            dispatch(login(hospital));
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
    <div className="w-full h-full flex">
        <div className="fixed z-20">
            {authStatus && (
              <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" link="/admin"/>
                <SidebarItem icon={<HeartHandshake size={20} />} text="Donors" link="/donors"/>
                <SidebarItem icon={<Users size={20} />} text="Recipient" link="/recipients"/>
                <SidebarItem icon={<History size={20} />} text="Match History" link={"/match-history"}/>
                <hr className="my-3" />
                <SidebarItem icon={<Settings size={20} />} text="Settings" link={"/settings"} />
                <SidebarItem icon={<HelpCircle size={20} />} text="Help" />
              </Sidebar>
            )}
        </div>
        <div className={`z-0 flex-1 overflow-auto ${authStatus? "ml-[4.29rem]" : "ml-0"}`}>
            {children}
        </div>
    </div>
  );
}

export default Container;

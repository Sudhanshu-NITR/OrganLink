import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "./store/authSlice";
import axios from "axios";
import Sidebar, { SidebarItem } from "./components/Sidebar/Sidebar.jsx";
import { NavLink } from "react-router-dom";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
} from "lucide-react";

function Container({ children }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status); // Ensure 'auth' is the correct slice name
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/v1/hospitals/current-hospital");
        if (response.status) {
          dispatch(login(response.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(logout());
        navigate("/");
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  return (
    <div className="w-full h-full flex">
        <div className="fixed z-20">
            {authStatus && (
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" link="/admin"/>
                <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
                <SidebarItem icon={<UserCircle size={20} />} text="Users" />
                <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
                <SidebarItem icon={<Package size={20} />} text="Orders" alert />
                <SidebarItem icon={<Receipt size={20} />} text="Billings" />
                <hr className="my-3" />
                <SidebarItem icon={<Settings size={20} />} text="Settings" />
                <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
            </Sidebar>
            )}
        </div>
        <div className={` z-0 flex-1 overflow-auto ${authStatus? "ml-[4.29rem]" : "ml-0"}`}>
            {children}
        </div>
    </div>
  );
}

export default Container;

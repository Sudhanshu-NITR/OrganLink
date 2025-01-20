import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const hospital = useSelector((state) => state.auth.hospital);
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-[#fff4ec] border-r shadow-sm" aria-label="Main Navigation">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="../../image.png"
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "w-16" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
            aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {expanded ? <ChevronFirst aria-hidden="true" /> : <ChevronLast aria-hidden="true" />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3" role="list">
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={hospital?.avatar}
            alt={`${hospital?.name}'s avatar`}
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all duration-300 ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{hospital?.name}</h4>
              <span className="text-xs text-gray-600">{hospital?.email}</span>
            </div>
            <button 
              className="hover:bg-orange-50 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 "
              aria-label="More options"
            >
              <MoreVertical size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem = ({ icon, text, active, alert, link }) => {
  const { expanded } = useContext(SidebarContext);
  
  return (
    <li>
      <Link 
        to={link}
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-orange-100 to-orange-50 text-orange-900"
              : "hover:bg-orange-50 text-gray-600"
          }
        `}
        aria-current={active ? "page" : undefined}
      >
        <span className="flex items-center" aria-hidden="true">
          {icon}
        </span>
        <span
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${
              expanded ? "" : "top-2"
            }`}
            aria-label="notification alert"
          />
        )}

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-orange-100 text-orange-800 text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
            role="tooltip"
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
};

export default Sidebar;
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false)
  const hospital = useSelector((state)=> state.auth.userData);
  console.log(hospital);
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-[#fff4ec] border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="../../image.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-16" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, link }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <Link to={link}>
      <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
          ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-800"
          : "hover:bg-orange-50 text-gray-600"
        }
        `}
        >
      {icon}
      <span
          className={`overflow-hidden transition-all ${
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
          >
          {text}
          </div>
      )}
      </li>
    </Link>
  )
}
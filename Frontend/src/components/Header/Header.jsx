import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link }  from 'react-scroll'
import LogoutBtn from './LogoutBtn'
import "./Header.css"
import { useSelector } from 'react-redux'


function Header() {
    const authStatus = useSelector((state)=> state.auth.status);
    const navigate = useNavigate()

    const navItems = [
        {
            name: "Home",
            slug: "home",
            active: true,
        },
        {
            name: "About Us",
            slug: "about",
            active: true,
        },
        {
            name: "Help",
            slug: "help",
            active: true,
        }
    ]

    return (
        <>
            <header className="header bg-[#da7224] h-[15vh] min-w-screen flex justify-between items-center px-4 text-white font-serif">
                <div className="flex items-center gap-4">
                    <NavLink to='/'>
                        <img src='../../image.png' alt="OrganLink Logo" className="h-16 mx-4" />
                    </NavLink>
                    <h1 className="text-[2.1rem] font-bold">OrganLink</h1>
                </div>
                <nav className="flex text-lg font-medium items-center flex-wrap space-x-4">
                    {
                        navItems.map((item)=>(
                            <Link to={item.slug}
                            className=" hover:border-white hover:rounded-[2rem] hover:border-[1.2px] duration-200 h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg"    
                            activeClassName="font-bold"
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            >
                                {item.name}
                            </Link>
                        ))
                    }
                    {!authStatus && (
                        <NavLink to='/login'
                        className=" hover:border-white hover:rounded-[2rem] hover:border-[1.2px] duration-200 h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg"    
                        activeClassName="font-bold"
                        >
                            Login
                        </NavLink>
                    )}
                    {authStatus && (
                        <div>
                            <LogoutBtn/>
                        </div>
                    )}
                    {!authStatus && (
                        <NavLink to="/register" 
                        className="bg-[#646c3c] duration-200 h-[8vh] w-[10vw] flex justify-center items-center rounded-[2rem] hover:bg-[#80904c] shadow-lg " 
                        activeClassName=""
                        >
                            Get Started
                        </NavLink>
                    )}
                </nav>
            </header>
            
        </>
    )
}

export default Header

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import LogoutBtn from './LogoutBtn.jsx'
import "./Header.css"
import { useSelector } from 'react-redux'

function Header() {
    const authStatus = useSelector((state)=> state.auth.status);
    const navigate = useNavigate();

    const scrollToElement = (elementId)=>{
        const element = document.getElementById(elementId)
        if(element){
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

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
                    <NavLink to='/'>
                        <h1 className="text-[2.1rem] font-bold">OrganLink</h1>
                    </NavLink>
                </div>
                <nav className="flex text-lg font-medium items-center flex-wrap space-x-4">
                    {
                        navItems.map((item, index)=>(
                            <NavLink to={`/#${item.slug}`}
                            key = {index}
                            className=" hover:border-white hover:rounded-[2rem] hover:border-[1.2px] duration-200 h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg cursor-pointer"    
                            activeClass="font-bold"
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            >
                                {item.name}
                            </NavLink>
                        ))
                    }
                    {!authStatus && (
                        <NavLink to='/login'
                        className=" hover:border-white hover:rounded-[2rem] hover:border-[1.2px] duration-200 h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg"    
                        activeClass="font-bold"
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
                        activeClass=""
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
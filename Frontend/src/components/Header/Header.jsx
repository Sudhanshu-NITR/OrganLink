import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link }  from 'react-scroll'
import "./Header.css"


function Header() {
    return (
        <>
            <header className="header bg-[#da7224] h-[15vh] min-w-screen flex justify-between items-center px-4 text-white font-serif">
                <div className="flex items-center gap-4">
                    <img src='../../image.png' alt="OrganLink Logo" className="h-16 mx-4" />
                    <h1 className="text-[2.1rem] font-bold">OrganLink</h1>
                </div>
                <nav className="flex text-lg font-medium items-center flex-wrap space-x-4">
                    <Link to="home" 
                    className=" hover:border-white hover:rounded-[2rem] hover:border-[1.2px] h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg"    
                    activeClassName="font-bold"
                    spy={true} 
                    smooth={true} 
                    offset={-100} 
                    duration={500} 
                    >
                        Home
                    </Link>
                    <NavLink to="/about" 
                    className="hover:border-white hover:rounded-[2rem] hover:border-[1.2px] h-[7vh] w-[8vw] flex justify-center items-center hover:shadow-lg" 
                    activeClassName="font-bold"
                    >
                        About Us
                    </NavLink>
                    <NavLink to="/help" 
                    className="hover:border-white hover:rounded-[2rem] hover:border-[1.2px] h-[7vh] w-[7vw] flex justify-center items-center hover:shadow-lg" 
                    activeClassName="font-bold"
                    spy={true} smooth={true} hashSpy={true} offset={50} duration={500} delay={1000} isDynamic={true}
                    >
                        Help
                    </NavLink>
                    <NavLink to="/" 
                    className="bg-[#646c3c] h-[8vh] w-[10vw] flex justify-center items-center rounded-[2rem] hover:bg-[#80904c] shadow-lg " 
                    activeClassName=""
                    spy={true} smooth={true} hashSpy={true} offset={50} duration={500} delay={1000} isDynamic={true}
                    >
                        Get Started
                    </NavLink>
                </nav>
            </header>
            
        </>
    )
}

export default Header

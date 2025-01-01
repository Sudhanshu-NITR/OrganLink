import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'

function Footer() {
    return (
        <>
            <footer>
                <div className='p-[2rem] bg-[#502c04] mt-[2rem] text-[#ddd6ce]'>
                    <div className='flex mt-[1rem]'>
                        <div className='flex-col left-0'>
                            <div className='text-3xl'>
                                Stay Connected!!
                            </div>
                            <p className='max-w-[22rem]'>
                                Join our community and help us make a difference in organ donation. Together, we can save lives!
                            </p>
                        </div>
                        <ul className='ml-[12rem] leading-8'>
                            <Link to="home" 
                            className="hover:text-[#646c3c]"  
                            activeClassName="font-bold"
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            >
                                Home
                            </Link>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>About Us</li></NavLink>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>Services</li></NavLink>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>Gallery</li></NavLink>
                        </ul>
                        <ul className='ml-[16rem] leading-8'>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>FAQs</li></NavLink>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>Privacy Policy</li></NavLink>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>Terms of Service</li></NavLink>
                            <NavLink to="/home" className="hover:text-[#646c3c]"><li>Support</li></NavLink>
                        </ul>
                    </div>
                    <p className='mt-[2rem] flex justify-center items-center'>© 2024 OrganLink. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer

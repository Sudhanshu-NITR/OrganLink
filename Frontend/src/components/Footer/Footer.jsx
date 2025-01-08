import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'



function Footer() {
    const footerItems1 = [
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
        },
        {
            name: "Gallery",
            slug: "/gallery" ,
            active: true
        },
    ]
    const footerItems2 = [
        {
            name: "FAQs",
            slug: "/faq",
            active: true
        },
        {
            name: "Privacy Policy",
            slug: "/policy",
            active: true
        },
        {
            name: "Terms of Service",
            slug: "/terms",
            active: true
        },
        {
            name: "Support",
            slug: "/support",
            active: true
        },
    ]

    return (
        <>
            <footer>
                <div className='p-[2rem] bg-[#502c04] text-[#ddd6ce]'>
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
                            {
                                footerItems1.map((item)=>(
                                    <li key={item.name}>
                                        <Link to={item.slug} 
                                        className="hover:text-[#646c3c]"  
                                        activeClass="font-bold"
                                        spy={true} 
                                        smooth={true} 
                                        offset={-100} 
                                        duration={500} 
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                        <ul className='ml-[16rem] leading-8'>
                                {
                                footerItems2.map((item)=>(
                                    <li key={item.name}>
                                        <Link to={item.slug} 
                                        className="hover:text-[#646c3c]"  
                                        activeClass="font-bold"
                                        spy={true} 
                                        smooth={true} 
                                        offset={-100} 
                                        duration={500} 
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <p className='mt-[2rem] flex justify-center items-center'>© 2024 OrganLink. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer

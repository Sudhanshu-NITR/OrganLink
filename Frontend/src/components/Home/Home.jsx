import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Link } from 'react-scroll'
import "./Home.css"
import { motion } from 'framer-motion'
import { ChevronDown, Heart, Hospital, Users, Phone, Mail, ArrowRight } from 'lucide-react'

function Home() {
    const location = useLocation();

    useEffect(()=>{
        if(location.hash){
            const elementId = location.hash.replace('#', '');
            const element = document.getElementById(elementId);
            if(element){
                element.scrollIntoView({behavior: 'smooth'})
            }
        }
    }, [location]);

    
    return (
        <div className="w-full overflow-hidden">
            {/* Hero Section */}
            <div id="home" className='relative w-full min-h-screen flex items-center justify-center'>
                <img 
                    src="../../hero.jpeg" 
                    alt="Hero Background" 
                    className='absolute w-full h-full object-cover'
                />
                <div className="absolute inset-0 bg-[#da7224]/80 mix-blend-multiply opacity-70"></div>
                
                <div className='relative z-10 max-w-7xl mx-auto px-4 text-center text-white'>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='font-serif mb-8 text-7xl leading-tight'
                    >
                        Connecting Lives,<br />Saving Futures
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <NavLink 
                            to="/register" 
                            className="inline-flex items-center gap-2 bg-[#646c3c] px-8 py-4 font-serif text-xl rounded-full hover:bg-[#80904c] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                        >
                            Join the Movement
                            <ArrowRight size={20} />
                        </NavLink>
                    </motion.div>

                    <Link 
                        to="stats" 
                        smooth={true} 
                        duration={800} 
                        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
                    >
                        <ChevronDown size={40} />
                    </Link>
                </div>
            </div>

            {/* Navigation */}
            {/* <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center space-x-12 py-6">
                        {['home', 'about', 'help'].map((section) => (
                            <Link
                                key={section}
                                to={section}
                                smooth={true}
                                duration={500}
                                className={`cursor-pointer font-serif text-lg capitalize transition-colors duration-300 hover:text-[#646c3c] ${
                                    isScrolled ? 'text-[#da7224]' : 'text-white'
                                }`}
                            >
                                {section}
                            </Link>
                        ))}
                    </div>
                </div>
            </div> */}

            {/* Stats Section */}
            <div id="stats" className='py-20 bg-gradient-to-b from-[#fff4ec] to-white'>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            { icon: <Heart className="text-[#da7224]" size={32} />, number: "1000+", text: "Lives Saved" },
                            { icon: <Hospital className="text-[#da7224]" size={32} />, number: "250+", text: "Hospitals Connected" },
                            { icon: <Users className="text-[#da7224]" size={32} />, number: "500+", text: "Active Donors" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className='bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300'
                            >
                                {stat.icon}
                                <p className='text-5xl font-serif mt-4'>{stat.number}</p>
                                <div className="w-16 h-1 bg-[#da7224] my-4"></div>
                                <p className='text-2xl font-serif text-gray-600'>{stat.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-6xl font-serif text-[#da7224]">About Us</h2>
                        <div className="w-24 h-1 bg-[#646c3c] mx-auto mt-6"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <p className="text-xl font-serif leading-relaxed">
                                We are dedicated to revolutionizing organ donation by connecting hospitals 
                                and streamlining the donation process. Our platform serves as a vital bridge 
                                between healthcare facilities, making organ matching and transfer more efficient 
                                than ever before.
                            </p>
                            <p className="text-xl font-serif leading-relaxed">
                                Our mission is to save lives by reducing waiting times and improving organ 
                                allocation through technology. We believe that every potential donor should 
                                have the opportunity to give the gift of life, and every patient in need 
                                should have the best possible chance of finding a match.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#fff4ec] rounded-2xl p-8 shadow-xl"
                        >
                            <h3 className="text-3xl font-serif text-[#646c3c] mb-8">Our Impact</h3>
                            <div className="space-y-6">
                                {[
                                    "Connected over 250 hospitals nationwide",
                                    "Facilitated 1000+ successful organ donations",
                                    "Reduced average matching time by 60%",
                                    "24/7 support for healthcare providers"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-[#da7224]"></div>
                                        <p className="text-lg font-serif">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div id="help" className="py-20 bg-[#fff4ec]">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-6xl font-serif text-[#da7224]">Help & Resources</h2>
                        <div className="w-24 h-1 bg-[#646c3c] mx-auto mt-6"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                title: "For Hospitals",
                                items: ["Register your facility", "Update organ availability", "Access donor matching system", "View transfer protocols"],
                                link: "/hospital/register",
                                linkText: "Hospital Registration"
                            },
                            {
                                title: "For Donors",
                                items: ["Register as a donor", "Learn about donation process", "Update medical information", "Contact support team"],
                                link: "/register",
                                linkText: "Become a Donor"
                            },
                            {
                                title: "FAQ & Support",
                                items: ["Common questions", "Technical support", "Emergency contacts", "Resource library"],
                                link: "/support",
                                linkText: "Get Help"
                            }
                        ].map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-2xl font-serif text-[#646c3c] mb-6">{section.title}</h3>
                                <ul className="space-y-4 mb-8">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 font-serif">
                                            <div className="w-2 h-2 rounded-full bg-[#da7224]"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <NavLink
                                    to={section.link}
                                    className="inline-flex items-center gap-2 bg-[#646c3c] px-6 py-3 text-white rounded-xl hover:bg-[#80904c] transition-all duration-300 cursor-pointer font-serif"
                                >
                                    {section.linkText}
                                    <ArrowRight size={16} />
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-12 shadow-xl"
                    >
                        <h3 className="text-3xl font-serif text-[#646c3c] mb-8 text-center">Need Immediate Assistance?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {[
                                {
                                    title: "General Support",
                                    description: "Our support team is available 24/7 to assist you with any queries or concerns.",
                                    phone: "1-800-ORGAN-HELP",
                                    email: "support@organdonation.com"
                                },
                                {
                                    title: "Hospital Priority Line",
                                    description: "For hospitals requiring urgent assistance with organ matching:",
                                    phone: "1-800-URGENT-MATCH",
                                    email: "urgent@organdonation.com"
                                }
                            ].map((contact, index) => (
                                <div key={index} className="font-serif">
                                    <h4 className="text-xl text-[#da7224] mb-4">{contact.title}</h4>
                                    <p className="text-lg mb-6">{contact.description}</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 cursor-pointer hover:text-[#da7224] transition-colors">
                                            <Phone size={20} />
                                            <span className="text-lg">{contact.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 cursor-pointer hover:text-[#da7224] transition-colors">
                                            <Mail size={20} />
                                            <span className="text-lg">{contact.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Home
import React from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer'

function Layout() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow bg-[#fff4ec]">
                    <Header />
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Layout

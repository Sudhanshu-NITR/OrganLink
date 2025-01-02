import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Home.css"

function Home() {
    return (
        <>
            <body>
                <div id="home" className='w-full hero-container min-h-[700px]'>
                    <img src="../../hero.jpeg" alt="" className='w-full hero' />
                    <div class="absolute inset-0 bg-[#da7224] mix-blend-multiply cover"></div>
                    <div className='top-[4rem] left-[4rem] absolute inset-0 flex-col text-white inline-block'>
                        <div className='font-serif  mb-[2rem] text-6xl'>Connecting Lives, Saving Futures...</div>
                        <NavLink to="/" className="bg-[#646c3c] h-[8vh] inline-flex p-[1.8rem]  font-serif items-center rounded-[2rem] text-[1.2rem] hover:bg-[#80904c] shadow-lg " activeClassName="">Join the Movement</NavLink>
                    </div>
                    <div className='absolute top-[30rem] inset-0 h-48 w-full font-serif flex justify-evenly'>
                        <div className='h-full w-56 rounded-2xl shadow-xl p-[2rem] bg-[#fff4ec]'>
                            <img src="../../heart-solid.svg" alt="" className='h-[2rem]'/>
                            <p className='text-5xl'>1000+</p>
                            <p className='text-2xl'>Donations</p>
                        </div>
                        <div className='h-full w-56 rounded-2xl bg-[#fff4ec] shadow-xl p-[2rem]'>
                            <img src="../../hospital-solid.svg" alt="" className='h-[2rem]'/>
                            <p className='text-4xl'>250+</p>
                            <p className='text-xl'>Hospitals connected</p>
                        </div>
                        <div className='h-full w-56 rounded-2xl bg-[#fff4ec] shadow-xl p-[2rem]'>

                        </div>
                    </div>
                </div>
                
            </body>
        </>
    )
}

export default Home

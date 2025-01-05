import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

function Admin() {
    const navigate = useNavigate();
    let userData = null;
    const dispatch = useDispatch();
    // const getUserProfile = useEffect(async ()=>{
    //     axios.get("/api/v1/hospitals/current-user")
    //     .then((response)=>{
    //         if(response.status){
    //             userData = response.data; 
    //             dispatch(login, {userData});
    //         }
    //         else{
    //             dispatch(logout());
    //             navigate("/login");
    //         }
    //     })
    //     .catch((error)=>{
    //         console.log("Error logging in, ERROR: ", error);
    //         dispatch(logout());
    //         navigate("/login");
    //     });

    // }, [navigate])

    return (
        <>
            <div className='bg-[#fff4ec] min-w-screen min-h-screen flex flex-wrap justify-evenly'>
                <div className='bg-white rounded-lg shadow-lg w-[80%] mt-10 m-5 p-16'>
                    <div className='w-full flex relative'>
                        <div className='w-32 h-32 bg-white shadow-xl rounded-full flex justify-center items-center'>
                            <img src="../hospital.png" className='w-40 rounded-full' />
                        </div>
                        <div className='right-4 absolute flex space-x-16'>
                            <div className='flex-col space-y-4 flex-wrap max-w-32 text-center'>
                                <div className='w-32 h-32 bg-[#A4D3A2] rounded-full text-[#333333]  flex justify-center items-center shadow-xl text-[2rem]'>
                                    
                                </div>
                                <h3 className='text-xl font-serif'>Donation Count</h3>
                            </div>
                            <div className='flex-col space-y-4 flex-wrap max-w-32 text-center'>
                                <div className='w-32 h-32 bg-[#A4D3A2] rounded-full text-[#333333]  flex justify-center items-center shadow-xl text-[2rem]'>

                                </div>
                                <h3 className='text-xl font-serif'>Reciever Count</h3>
                            </div>
                            <div className='flex-col space-y-4 flex-wrap max-w-32 text-center'>
                                <div className='w-32 h-32 bg-[#A4D3A2] rounded-full text-[#333333]  flex justify-center items-center shadow-xl text-[2rem]'>

                                </div>
                                <h3 className='text-xl font-serif'>Match Count</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin

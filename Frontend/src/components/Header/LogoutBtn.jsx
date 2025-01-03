import React from 'react'
import { useDispatch } from 'react-redux';
import { login, logout } from "../../store/authSlice.js";
import axios from 'axios'

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = () =>{
        try {
            axios.get("/api/v1/hospitals/logout")
            .then((response)=>{
                if(response.status){
                    console.log("User logged out Successfully!!");
                    dispatch(logout);
                }
                else{
                    console.log("Something went wrong while logging out");
                }
            })
            .catch((error)=>{
                console.log("User logout failed!! Error: ", error);
            })
        } catch (error) {
            console.log("User logout failed!! Error: ", error);
        }
    }
    return (
        <div
        className='inline-block px-6 py-2 duration-200 hover:bg-red-600 hover:text-white rounded-full hover:shadow-lg'
        >Logout</div>
    )
}

export default LogoutBtn

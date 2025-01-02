import React from 'react'
import {useDispatch} from 'react-redux'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = ()=>{
        axios.get('/api/v1/logout')
        .then(()=>{
            useDispatch(logout);
        })
        .catch((error)=>{
            console.log("Error while logging out, ERROR: ", error);
        })
    }
    return (
        <div
        className='inline-block px-6 py-2 duration-200 hover:bg-red-600 hover:text-white rounded-full hover:shadow-lg'
        >Logout</div>
    )
}

export default LogoutBtn

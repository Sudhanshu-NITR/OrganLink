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
        className=''
        >Logout</div>
    )
}

export default LogoutBtn

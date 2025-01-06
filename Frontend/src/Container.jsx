import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function Container() {
    const navigate = useNavigate();
    const authStatus = useSelector(state=> state.staus);
    const dispatch = useDispatch();
    const isLoggedIn = useEffect(()=>{
        const userData = axios.get("/api/v1/hospitals/current-hospital");
        console.log(userData);
        
        if(userData.status){
            dispatch(login(userData));
        }
        else{
            dispatch(logout());
        }
    }
    , [navigate, authStatus]);
    return (
        <>
            <div className='w-full h-full'></div>
        </>
    )
}

export default Container

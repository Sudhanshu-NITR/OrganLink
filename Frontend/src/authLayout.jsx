import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({children, request="/", authentication=true}){
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => (state.auth.status))?? false;
    // console.log(authStatus, authentication);

    
    useEffect(()=>{
        if (authStatus === undefined) return;
        
        if(authentication && authStatus!==authentication){
            navigate("/login");
        }
        else if(!authentication && authStatus!==authentication){
            navigate(request.trim());
        }
        setLoader(false);
    }, [navigate, request]);


    return loader? <h1>Loading...</h1> : <>{children}</>
}
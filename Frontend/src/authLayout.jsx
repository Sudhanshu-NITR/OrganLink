import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({children, request, authentication}){
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => (state.auth.status))?? false;
    
    
    useEffect(()=>{
        if (authStatus === undefined) return;
        
        if(authentication && authStatus!==authentication){
            navigate("/login");
        }
        else if(!authentication && authStatus!==authentication){
            navigate(toString(request.trim()));
        }
        setLoader(false);
    }, [navigate, request]);


    return loader? <h1>Loading...</h1> : <>{children}</>
}
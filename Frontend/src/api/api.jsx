import { login, logout } from "../store/authSlice";
import {useDispatch} from 'react-redux'
import axios from 'axios'

const backend_url = import.meta.env.VITE_BACKEND_URL;

const dispatch = useDispatch();

const registerUser = (userData)=>{
    try {
        axios.post('/api/v1/hospitals/register', userData)
        .then((response)=>{
            loginUser({
                email: response.email, 
                phone:response.phone, 
                password: userData.password
            });
        })
        .catch((error)=>{
            console.log("User registration failed!! ERROR: ", error);
        })
    }
    catch(error){
        console.log("User registration failed!! ERROR: ", error);
    }
}

const loginUser = (userData)=>{
    try {
        axios.get("/api/v1/hospitals/login", userData)
        .then((response)=>{
            if(response.status){
                console.log("User logged in Successfully!!");
                return response.data;
            }
            else{
                console.log("User login failed");
                
            }
        })
        .catch((error)=>{
            console.log("User login failed, ERROR: ", error);
        });
    } catch (error) {
        console.log("User login failed, ERROR: ", error);
    }
}

const authUser = () =>{
    try {
        axios.get("/api/v1/hospitals/current-user")
        .then((response)=>{
            const userData = response.data;
            if(response.status){
                dispatch(login({userData}));
                console.log("Authorized user!!");
            }
            else{
                dispatch(logout());
                console.log("Unauthorized user, login again!!");
            }
        })
        .catch((error)=>{
            console.log("User logout failed!! Error: ", error);
        })
    } catch (error) {
        console.log("User logout failed!! Error: ", error);
    }
}


export {registerUser, loginUser, logoutUser, authUser}
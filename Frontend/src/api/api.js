import { error } from "console";
import { login } from "../store/authSlice";
import axios from 'axios'

const backend_url = import.meta.env.VITE_BACKEND_URL;

const registerUser = async(userData)=>{
    try {
        await axios.post('/api/v1/hospitals/register', userData)
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

const loginUser = async(userData)=>{
    try {
        await axios.get("/api/v1/hospitals/login", userData)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log("User login failed, ERROR: ", error);
        });
    } catch (error) {
        console.log("User login failed, ERROR: ", error);
    }
}

const logoutUser = async() =>{
    try {
        await axios.get("/api/v1/hospitals/logout")
        .then((response)=>{
            console.log("User logged out Successfully!!");
        })
        .catch((error)=>{
            console.log("User logout failed!! Error: ", error);
        })
    } catch (error) {
        console.log("User logout failed!! Error: ", error);
    }
}


export {registerUser, loginUser}
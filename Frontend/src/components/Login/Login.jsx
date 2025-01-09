import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../../store/authSlice'
import { useDispatch } from 'react-redux'
import Input from '../Header/Input'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();


    const login = async(data) =>{
        setError("");
        console.log(data);
        
        try {
            axios.post("/api/v1/hospitals/login", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response)=>{
                if(response.status){
                    dispatch(authLogin(data));
                    console.log("User logged in Successfully!!");
                    navigate('/admin');
                }
                else{
                    dispatch(logout());
                    navigate("/");
                    console.log("User login unsuccessfull!!");
                }
            })
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div
            className='flex items-center justify-center w-full font-serif mt-[2rem]'
        >
            <div
                className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 mt-2rem`}
            >
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <img src='../image.png' className='w-[100%]'/>
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold font-serif leading-tight'>
                    Sign in to your Account
                </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to='/register'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Register
                    </Link>
                </p>
                {error && 
                <p className='text-red-600 mt-8 text-center'>
                    {error}    
                </p>
                }
                {/* whenever we use register, handleSubmit will automatically pick those input values and handle them  */}
                <form onSubmit={handleSubmit(login)}
                    className='mt-8'
                > 
                    <div className='space-y-5'>
                        <Input 
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required:true,
                                validate: {
                                    matchPattern: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email address must be a valid address"
                                }
                            })}
                        />
                        <Input 
                            label="Mobile: "
                            placeholder="Enter your mobile number"
                            type="text"
                            {...register("phone", {
                                required:true,
                                validate: {
                                    matchPattern: (value) => /^\d{10}$/.test(value) || "Phone number must be 10 digits"
                                }
                            })}
                        />
                        <Input 
                            label='Password: '
                            type='password'
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <button
                        type="submit"
                        className='px-4 w-full py-2 rounded-lg bg-blue-600 text-white'
                        >Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

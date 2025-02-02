import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import Input from '../Header/Input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Loader2, Eye, EyeOff } from 'lucide-react';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const login = async(data) => {
        setError("");
        setIsLoading(true);
        
        try {
            const response = await axios.post("/api/v1/hospitals/login", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if(response.data.success){
                dispatch(authLogin(response.data.data.hospital));
                navigate('/admin');
            } else {
                setError("Invalid credentials. Please check your email and password.");
                dispatch(logout());
            }
        } catch (error) {
            setError("Invalid credentials. Please check your email and password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center w-full font-serif my-8">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <img src="../image.png" alt="Logo" className="w-full" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold font-serif leading-tight">
                    Sign in to your Account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/register"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Register
                    </Link>
                </p>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input 
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => 
                                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
                                        "Email address must be a valid address"
                                },
                            })}
                        />
                        <Input 
                            label="Mobile: "
                            placeholder="Enter your mobile number"
                            type="text"
                            {...register("phone", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => 
                                        /^\d{10}$/.test(value) ||
                                        "Phone number must be 10 digits"
                                }
                            })}
                        />
                        <div className="relative">
                            <Input 
                                label="Password: "
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: true,
                                })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 
                                    <EyeOff className="h-5 w-5" /> : 
                                    <Eye className="h-5 w-5" />
                                }
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-blue-400 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
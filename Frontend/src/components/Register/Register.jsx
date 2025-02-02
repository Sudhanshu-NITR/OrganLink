import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import Input from '../Header/Input';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Loader2, Upload } from 'lucide-react';

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();
    const [preview, setPreview] = useState(null);

    const createAccount = async (data) => {
        setError("");
        setIsLoading(true);
        const formData = new FormData();
        
        try {
            // Append form data
            Object.keys(data).forEach((key) => {
                if (key === "avatar") {
                    if (data[key][0]) {
                        formData.append(key, data[key][0]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await axios.post("/api/v1/hospitals/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                dispatch(login(response.data.data));
                navigate("/admin");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please check your information.");
        } finally {
            setIsLoading(false);
        }
    };

    const file = watch("avatar");

    useEffect(() => {
        if (file && file[0]) {
            // Validate file size (max 5MB)
            if (file[0].size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            
            // Validate file type
            if (!file[0].type.startsWith('image/')) {
                setError("Please upload a valid image file");
                return;
            }

            const imageUrl = URL.createObjectURL(file[0]);
            setPreview(imageUrl);

            // Cleanup
            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [file]);

    return (
        <div className="flex items-center justify-center w-full font-serif my-8">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <img src="../image.png" alt="Logo" className="w-full" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold font-serif leading-tight">
                    Register to create account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
                </p>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(createAccount)} className="mt-8">
                    <div className="space-y-4">
                        <Input 
                            label="Hospital Name:"
                            placeholder="Enter full name of the Hospital"
                            {...register("name", {
                                required: "Hospital name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters long"
                                }
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}

                        <Input 
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}

                        <Input 
                            label="Mobile:"
                            placeholder="Enter your mobile number"
                            type="tel"
                            {...register("phone", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit mobile number"
                                }
                            })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}

                        <Input 
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                    message: "Password must contain at least one letter and one number"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}

                        <Input 
                            label="Address:"
                            type="text"
                            placeholder="Enter the address of Hospital"
                            {...register("address", {
                                required: "Address is required",
                                minLength: {
                                    value: 10,
                                    message: "Please enter a complete address"
                                }
                            })}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">{errors.address.message}</p>
                        )}

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
                                >
                                    <Upload className="h-5 w-5" />
                                    Upload Hospital Image
                                </label>
                                <input 
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...register("avatar", {
                                        required: "Hospital Image is required"
                                    })}
                                />
                            </div>
                            
                            {preview && (
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-sm font-medium">Logo Preview:</h3>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                </div>
                            )}
                            {errors.avatar && (
                                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
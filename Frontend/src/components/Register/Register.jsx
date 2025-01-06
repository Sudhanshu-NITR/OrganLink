import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../store/authSlice'
import Input from '../Header/Input'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}, watch} = useForm();
    const [preview, setPreview] = useState(null);
    const createAccount = async(data)=>{
        setError("");
        const formData = new FormData();
        // console.log(data);
        
        Object.keys(data).forEach((key) => {
            if(key === "avatar") {
                formData.append(key, data[key][0]);
            } 
            else {
                formData.append(key, data[key]);
            }
        });
        try {
            axios.post("/api/v1/hospitals/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response)=>{
                if(response.status){
                    const userData = response.data;

                    // if(userData) dispatch(login(userData));
                    navigate("/admin");
                }
            })
            .catch((error)=>{
                setError(error.message);
            })
        } catch (error) {
            setError(error.message);
        }
    }

    const file = watch("avatar");

    useEffect(() => {
        if (file && file[0]) {
            console.log(file);
            
          const imageUrl = URL.createObjectURL(file[0]);
          setPreview(imageUrl);
        }
    }, [file]);

    return (
        <div className="flex items-center justify-center w-full font-serif mt-[2rem]">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 mt-2rem `}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <img src='../image.png' className='w-[100%]'/>
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold font-serif leading-tight'>
                    Register to create account
                </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Already have an account?&nbsp;
                    <Link
                        to='/login'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Login
                    </Link>
                    {error && 
                    <p className='text-red-600 mt-8 text-center'>{error}</p>
                    }

                    <form onSubmit={handleSubmit(createAccount)}
                    className='mt-8'
                    >
                        <div className='space-y-5 text-left'>
                            <Input 
                            label="Full Name"
                            placeholder="Enter full name of the Hospital"
                            {...register("name", {
                                required: true
                            })}
                            />
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
                            <Input 
                                label='Address: '
                                type='text'
                                placeholder="Enter the address of Hospital"
                                {...register("address", {
                                    required: true,
                                })}
                            />
                            <div className='flex flex-wrap justify-between'>
                                <label
                                    htmlFor="file-upload"
                                    className='inline-block max-h-[2.5rem] bg-green-500 text-white px-3 py-2 text-base rounded-md cursor-pointer '
                                >
                                    Upload avatar
                                </label>
                                <input 
                                    id= "file-upload"
                                    label='Image: '
                                    type="file"
                                    accept="image/*"
                                    placeholder=""
                                    className='mb-[1rem] hidden'
                                    {...register("avatar", {
                                        required: true,
                                    })}
                                />
                                {preview && (
                                    <div className='justify-end'>
                                        <h3>Avatar Preview:</h3>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className='max-w-20 max-h-40 '
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                            type="submit"
                            className='px-4 w-full py-2 rounded-lg bg-blue-600 text-white'
                            >Register</button>
                        </div>
                    </form>

                </p>
            </div>
        </div>
    )
}

export default Register

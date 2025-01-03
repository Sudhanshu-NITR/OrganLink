import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../store/authSlice'
import Input from '../Header/Input'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();

    const createAccount = async(data)=>{
        setError("");
        try {
            
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <div className='w-full h-full flex align-middle justify-center'>
                <div className='border border-black h-[40rem] w-[40rem] rounded-2xl shadow-xl bg-[#fff4ec] mt-[2rem] p-[4rem]'>
                    <div className='w-full flex justify-center'><h2 className='text-4xl font-serif'>Create Account</h2></div>
                    
                </div>
            </div>
        </>
    )
}

export default Register

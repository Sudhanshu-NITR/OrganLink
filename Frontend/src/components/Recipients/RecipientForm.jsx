import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../Header/Input.jsx';
import axios from 'axios';

const RecipientForm = ({isFormOpen, setIsFormOpen, donor_id, register, handleSubmit, reset}) => {

  const addRecipient = (data) => {
    data.donor_id = donor_id
    console.log(data);
    try {
      axios.post('/api/v1/hospitals/recipient/send-request', data)
      .then((response)=>{
        if(response.data.success){
          console.log("Request added Successfully!!");
        }
      })
      .catch((error)=>{
        console.log("Request addition failed!!, ERROR: ", error);
      })
    } catch (error) {
      console.log("Request addition failed!!, ERROR: ", error);
    }
    reset();
    setIsFormOpen(false);
  };


  return (
    <div className={`min-w-[40rem] rounded-lg border border-black/10 font-serif bg-gray-100 transition-all ease-in-out duration-300 `}>
      <div className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <form onSubmit={handleSubmit(addRecipient)} className="space-y-5 p-8 font-medium bg-gray-50">
          <div className='flex space-x-4'>
            <Input 
              label="Name:"
              placeholder="Enter recipient name"
              type="text"
              {...register("fullName", {
                required: true,
              })}
            />
            <Input 
              label="Age:"
              placeholder="Enter recipient age"
              type="Number"
              {...register("age", {
                required: true,
              })}
            />
          </div>
          <div className='flex space-x-4'>
            <Input 
                label="Organ Needed: "
                placeholder="Organ needed"
                type="text"
                {...register("organNeeded", {
                    required:true,
                })}
            />
            <Input 
                label="Blood Type: "
                placeholder="Enter recipient's blood type"
                type="text"
                {...register("bloodType", {
                    required:true,
                })}
            />
          </div>
          <div className='flex space-x-4'>
            <Input 
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required:true,
                  validate: {
                    matchPattern: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email address must be a valid address"
                    },
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
          </div>
          <div className='w-full flex justify-end'>
            <button
              type="submit"
              className="min-w-[4rem] py-2 px-4 rounded-lg bg-blue-400 text-white"
            >
              Generate Request 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientForm;
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Input from '../Header/Input.jsx';
import axios from 'axios';

const DonorForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {register, handleSubmit, reset} = useForm();

    const addDonor = (data) => {
      try {
        axios.post('/api/v1/hospitals/donor/add-donor', data)
        .then((response)=>{
          if(response.status){
            console.log("Donor added Successfully!!");
          }
          else{
            console.log("Donor addition failed!!,");
          }
        })
        .catch((error)=>{
            console.log("Donor addition failed!!,");
        })
      } catch (error) {
        
      }
      reset();
      setIsOpen(false);
    };

    return (
      <div className="min-w-[40rem] rounded-lg border border-black/10 font-serif bg-gray-100">
        <div
          className="flex items-center justify-between cursor-pointer w-full h-full py-6 px-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex justify-between space-x-4'>
            <UserPlus />
            <h3 className="text-xl font-medium">Add Donor</h3>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        <div className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <form onSubmit={handleSubmit(addDonor)} className="space-y-5 p-8 font-medium bg-gray-50">
            <div className='flex space-x-4'>
              <Input 
                label="Name:"
                placeholder="Enter donor name"
                type="text"
                {...register("fullName", {
                  required: true,
                })}
              />
              <Input 
                label="Age:"
                placeholder="Enter donor age"
                type="Number"
                {...register("age", {
                  required: true,
                })}
              />
            </div>
            <div className='flex space-x-4'>
              <Input 
                  label="Organ Type: "
                  placeholder="Organ to be donated"
                  type="text"
                  {...register("organType", {
                      required:true,
                  })}
              />
              <Input 
                  label="Blood Type: "
                  placeholder="Enter donor's blood type"
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
                Add donor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default DonorForm;
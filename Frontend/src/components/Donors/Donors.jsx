import React, { useState } from 'react'
import DonorCard from './DonorCard';
import axios from 'axios';

function Donors({}) {
    let donorList;
    const donors = () =>{
        try {
            axios.get("/api/v1/hospitals/donor/donors")
            .then((response)=>{
                donorList = response.data.data;
            })
            .catch((error)=>{
                console.log("Donor data fetching failed, ERROR: ", error);
            })
        } catch (error) {
            console.log("Donor data fetching failed, ERROR: ", error);
        }
    }

    donors();

    return (
        <>
            <div className='w-full h-full flex flex-col items-center justify-center p-16 space-y-4'>
                {
                    donorList.map((item, index)=>(
                        <DonorCard 
                        status={item.status} 
                        age={item.age}
                        bloodType={item.bloodType} 
                        organType={item.organType}
                        key={index}
                        id={item._id}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default Donors;
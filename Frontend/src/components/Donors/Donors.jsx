import React, { useState, useEffect } from 'react';
import DonorCard from './DonorCard';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import DonorForm from './DonorForm';

function Donors() {
    const [donorList, setDonorList] = useState([]);
    const {register, handleSubmit, reset} = useForm();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/v1/hospitals/donor/donors');
                if(response.data.success) setDonorList(response.data.data);
            } catch (error) {
                console.log('Donor data fetching failed, ERROR: ', error);
            }
        })();
    }, [handleSubmit]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-16 space-y-4 bg-[#fff4ec]'>
            <DonorForm register={register} handleSubmit={handleSubmit} reset={reset}/>
            {donorList.length > 0 ? (
                donorList.map((item, index) => (
                    <DonorCard
                        key={index}
                        status={item.status}
                        fullName={item.fullName}
                        age={item.age}
                        bloodType={item.bloodType}
                        organType={item.organType}
                        id={item._id}
                        setDonorList
                    />
                ))
            ) : (
                <p>No donors available.</p>
            )}
        </div>
    );
}

export default Donors;
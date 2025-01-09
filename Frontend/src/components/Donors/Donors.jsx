import React, { useState, useEffect } from 'react';
import DonorCard from './DonorCard';
import axios from 'axios';
import DonorForm from './DonorForm';

function Donors() {
    const [donorList, setDonorList] = useState([]);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get('/api/v1/hospitals/donor/donors');
                setDonorList(response.data.data); // Update the state with the fetched data
            } catch (error) {
                console.log('Donor data fetching failed, ERROR: ', error);
            }
        };

        fetchDonors();
    }, []); // Empty dependency array ensures it runs only once after the component mounts

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-16 space-y-4 bg-[#fff4ec]'>
            <DonorForm />
            {donorList.length > 0 ? (
                donorList.map((item, index) => (
                    <DonorCard
                        key={index}
                        status={item.status}
                        fullName={item.fullName}
                        age={item.age}
                        bloodType={item.bloodType}
                        organType={item.organType}
                        id={item._id.toString()}
                    />
                ))
            ) : (
                <p>No donors available.</p>
            )}
        </div>
    );
}

export default Donors;

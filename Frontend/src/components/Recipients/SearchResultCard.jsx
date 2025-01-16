import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RecipientForm from './RecipientForm';

const SearchResultCard = ({ donor, register, handleSubmit, reset }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <div className="p-6 min-w-[50rem]">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">{donor.fullName}</h3>
                        <p className="text-gray-600">Hospital: {donor.hospital.name}</p>
                        <div className="flex space-x-4 text-gray-600">
                            <p>Age: {donor.age}</p>
                            <p>Blood Group: {donor.bloodType}</p>
                            <p>Organ Type: {donor.organType}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <span>Raise Request</span>
                        {isFormOpen ? <ChevronUp size={20} /> : <ChevronDown size={20}/>}
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <RecipientForm isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} donor_id={donor._id} register={register} handleSubmit={handleSubmit} reset={reset}/>
            )}
        </div>
    );
};

export default SearchResultCard;
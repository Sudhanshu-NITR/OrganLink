import React, { useEffect, useState } from 'react';
import RecipientCard from './RecipientCard.jsx';
import axios from 'axios';
import SearchResultCard from './SearchResultCard.jsx';

const Recipient = () => {
    const [searchParams, setSearchParams] = useState({
        organType: '',
        bloodType: '',
        age: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [recipientList, setRecipientList] = useState([]);

    useEffect(() => {
        (async()=>{
            try {
                const response = await axios.get('/api/v1/hospitals/recipient/recipients');
                if(response.data.success) setRecipientList(response.data.data);
            } catch (error) {
                console.log('Recipient data fetching failed, ERROR: ', error);
            }
        })();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSearch = async(searchParams) =>{
        // console.log(searchParams);
        
        try {
            axios.get("/api/v1/hospitals/recipient/search-donors", {
                params: {
                    organType: searchParams.organType,
                    bloodType: searchParams.bloodType,
                    age: searchParams.age,
                },
            })
            .then((response)=>{
                // console.log(response.data.data);
                
                if(response.data.success){
                    setSearchResults(response.data.data);
                }
            })
            .catch((error)=>{
                console.log("Error searching for a Donor!! ERROR: ", error);
            })
        } catch(error){
            console.log("Error searching for a Donor!! ERROR: ", error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-16 space-y-4 bg-[#fff4ec]">
            <div className="flex flex-col space-y-4 min-w-[50rem] items-center">
                    <h2 className='text-xl font-serif font-medium'>Search Donors</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="organType" className="mb-2 text-sm font-medium text-gray-700">
                            Organ Type
                        </label>
                        <select
                            id="organType"
                            name="organType"
                            value={searchParams.organType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Organ Type</option>
                            <option value="Kidney">Kidney</option>
                            <option value="Liver">Liver</option>
                            <option value="Heart">Heart</option>
                            <option value="Lungs">Lungs</option>
                            <option value="Eyes">Eyes</option>
                            <option value="Pancreas">Pancreas</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="bloodType" className="mb-2 text-sm font-medium text-gray-700">
                            Blood Group
                        </label>
                        <select
                            id="bloodType"
                            name="bloodType"
                            value={searchParams.bloodType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="age" className="mb-2 text-sm font-medium text-gray-700">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={searchParams.age}
                            onChange={handleInputChange}
                            placeholder="Enter age"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button 
                    className="w-[60%] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => onSearch(searchParams)}
                >
                    Search Donors
                </button>
            </div>
            {searchResults.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                    <div className="space-y-4">
                        {searchResults.map((donor, index) => (
                            <SearchResultCard 
                                donor={donor}
                                key={donor._id}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className='w-full h-full flex flex-col items-center justify-center p-16 space-y-4 bg-[#fff4ec]'>
                <hr class="border-t-1 w-[60%] border-gray-200" />
                <h2 className="text-lg font-semibold mb-4">Request History</h2>
                {recipientList.length > 0 ? (
                    recipientList.map((recipient, index) => (
                        <RecipientCard key={index} recipient={recipient} recipientList={recipientList} setRecipientList={setRecipientList}/>
                    ))
                ) : (
                    <p>No Recipients!!</p>
                )}
            </div>
        </div>
    );
};

export default Recipient;
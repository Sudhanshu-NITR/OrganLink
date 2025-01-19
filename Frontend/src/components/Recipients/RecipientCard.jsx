import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Building2, Phone, MapPin } from 'lucide-react';
import axios from 'axios'

const RecipientCard = ({ recipient, recipientList, setRecipientList }) => {
  const [showHospital, setShowHospital] = useState(false);

  const deleteRecipient = async()=>{
    try {
        await axios.delete(`/api/v1/hospitals/recipient/delete/${recipient._id}`)
        .then((response)=>{
            if(response.data.success){
                const newRecipientList = recipientList.filter((item)=> item._id!=recipient._id)
                // console.log(newDonorList);
                setRecipientList(newRecipientList);
            }
        })
        .catch((error)=>{
            console.log("Error while deleting the Recipient, ERROR: ", error);
        })
    } catch (error) {
        console.log("Error while deleting the recipient, ERROR: ", error);
    }
}

  return (
    <div className="bg-gray-100 rounded-xl p-8 min-w-[50rem] shadow-sm">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">{recipient.fullName}</h3>
                <div className="text-gray-600">
                    <p>Age: {recipient.age}</p>
                    <p>Blood Group: {recipient.bloodType}</p>
                    <p>Organ Type: {recipient.organNeeded}</p>
                </div>
            
            </div>

            <div className="flex flex-col justify-between h-full space-y-2">
                <div className={`flex items-center space-x-2 ${
                    ((recipient.status === 'unmatched')||(recipient.status === 'rejected')) ? 'text-red-600' : 'text-green-600'
                    }`}>
                    <span>Status: {recipient.status}</span>
                    {recipient.status === 'unmatched' ? (
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    ): (<span className="text-2xl font-extrabold text-green-600">✓</span>)}
                </div>
                {/* <span className={`px-3 py-1 rounded-full text-sm ${
                    recipient.urgency === 'High' ? 'bg-red-100 text-red-800' :
                    recipient.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {recipient.urgency} Priority
                </span> */}
                {recipient.status === "unmatched" && 
                    <div className="flex justify-end space-x-2">
                        <button 
                            type="button"
                            className="bg-red-600 hover:bg-red-700 transition-colors w-8 h-8 flex justify-center items-center rounded-md text-white"
                            onClick={deleteRecipient}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                }
                {recipient.status=="matched" && (
                    <button
                        onClick={() => setShowHospital(!showHospital)}
                        className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Hospital Details</span>
                        {showHospital ? (
                        <ChevronUp className="w-4 h-4" />
                        ) : (
                        <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                )}

            </div>
        </div>

        <div className={`mt-3 w-full bg-white rounded-lg transition-all duration-300 ease-in-out  ${showHospital? "opacity-100 max-h-96":"opacity-0 max-h-0 overflow-hidden"}`}>
            <div className='p-4 shadow-sm'>
                <div className="flex items-center space-x-2 text-gray-700">
                    <Building2 className="w-4 h-4" />
                    <span>{recipient.hospital?.name || "Hospital Name"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span>{recipient.hospital?.contact || "Contact Number"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{recipient.hospital?.address || "Hospital Address"}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RecipientCard;
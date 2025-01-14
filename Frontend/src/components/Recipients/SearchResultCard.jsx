import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RecipientForm from './RecipientForm';

const SearchResultCard = ({ donor }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientAge: '',
        recipientBloodGroup: '',
        medicalHistory: '',
        contactNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

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
                        {isFormOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <RecipientForm isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen}/>
                // <div className="px-6 pb-6 bg-gray-50 border-t">
                //     <form onSubmit={handleSubmit} className="space-y-4">
                //         <h4 className="text-lg font-medium text-gray-800 pt-4">Recipient Information</h4>
                        
                //         <div className="grid grid-cols-2 gap-4">
                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Recipient Name
                //                 </label>
                //                 <input
                //                     type="text"
                //                     name="recipientName"
                //                     value={formData.recipientName}
                //                     onChange={handleInputChange}
                //                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                //                     required
                //                 />
                //             </div>

                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Age
                //                 </label>
                //                 <input
                //                     type="number"
                //                     name="recipientAge"
                //                     value={formData.recipientAge}
                //                     onChange={handleInputChange}
                //                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                //                     required
                //                 />
                //             </div>

                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Blood Group
                //                 </label>
                //                 <select
                //                     name="recipientBloodGroup"
                //                     value={formData.recipientBloodGroup}
                //                     onChange={handleInputChange}
                //                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                //                     required
                //                 >
                //                     <option value="">Select Blood Group</option>
                //                     <option value="A+">A+</option>
                //                     <option value="A-">A-</option>
                //                     <option value="B+">B+</option>
                //                     <option value="B-">B-</option>
                //                     <option value="AB+">AB+</option>
                //                     <option value="AB-">AB-</option>
                //                     <option value="O+">O+</option>
                //                     <option value="O-">O-</option>
                //                 </select>
                //             </div>

                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Contact Number
                //                 </label>
                //                 <input
                //                     type="tel"
                //                     name="contactNumber"
                //                     value={formData.contactNumber}
                //                     onChange={handleInputChange}
                //                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                //                     required
                //                 />
                //             </div>
                //         </div>

                //         <div>
                //             <label className="block text-sm font-medium text-gray-700 mb-1">
                //                 Medical History
                //             </label>
                //             <textarea
                //                 name="medicalHistory"
                //                 value={formData.medicalHistory}
                //                 onChange={handleInputChange}
                //                 rows="3"
                //                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                //                 required
                //             />
                //         </div>

                //         <div className="flex justify-end">
                //             <button
                //                 type="submit"
                //                 className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                //             >
                //                 Submit Request
                //             </button>
                //         </div>
                //     </form>
                // </div>
            )}
        </div>
    );
};

export default SearchResultCard;
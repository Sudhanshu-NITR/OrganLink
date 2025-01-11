import React from 'react';
import {Trash2 } from 'lucide-react';

const RecipientCard = ({ recipient }) => (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
            <h3 className="text-xl font-semibold">{recipient.name}</h3>
            <div className="text-gray-600">
                <p>Age: {recipient.age}</p>
                <p>Blood Group: {recipient.bloodGroup}</p>
                <p>Organ Type: {recipient.organType}</p>
            </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
            <div className={`flex items-center space-x-2 ${
                recipient.status === 'waiting' ? 'text-yellow-600' : 'text-green-600'
            }`}>
                <span>Status: {recipient.status}</span>
                {recipient.status === 'unmatched' && (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
                recipient.urgency === 'High' ? 'bg-red-100 text-red-800' :
                recipient.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
            }`}>
                {recipient.urgency} Priority
            </span>
        </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            Requests
            </button>
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export default RecipientCard;

import React, { useEffect, useState } from 'react';
import { Calendar, User, Heart, Activity } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns'

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Table = ({ children }) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const Th = ({ children }) => (  
  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200">
    {children}
  </td>
);

const HistoryTable = ({ data, type }) => (
  <Table>
    <thead>
      <tr>
        <Th>Date</Th>
        <Th>Organ Type</Th>
        <Th>{type === 'donor' ? 'Recipient Name' : 'Donor Name'}</Th>
        <Th>Blood Type</Th>
        <Th>Hospital</Th>
      </tr>
    </thead>
    <tbody>
      {data.length>0 &&
      data.map((match) => (
        <tr key={match._id}>
          <Td>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              {match.createdAt ? format(new Date(match.createdAt), 'dd/MM/yyyy') : 'N/A'}
            </div>
          </Td>
          <Td>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              {match.donorDetails.organType}
            </div>
          </Td>
          <Td>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              {type === 'donor' ? match.donorDetails.fullName : match.recipientDetails.fullName}
            </div>
          </Td>
          <Td>{type === 'donor' ? match.donorDetails.bloodType : match.recipientDetails.bloodType}</Td>
          <Td>{type === 'donor' ? (match.donorHospitalName || 'Unknown') : match.recipientHospitalName || 'Unknown'}</Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const MatchHistory = () => {

  const [donorHistory, setDonorHistory] = useState([]);
  const [recipientHistory, setRecipientHistory] = useState([]);

  useEffect(() => {
    try {
      axios.get("/api/v1/hospitals/match-history")
        .then((response) => {
          if (response.data.success) {
            setDonorHistory(response.data.data.donors);
            setRecipientHistory(response.data.data.recipients);
          }
        })
        .catch((error) => {
          console.log("Error fetching donor history, ERROR: ", error);
        });
    } catch (error) {
      console.log("Error fetching donor history, ERROR: ", error);
    }
  }, []);

  return (
    <div className="p-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match History</h1>
          <p className="text-gray-500 mt-1">Organ Donation Match Records</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Heart className="text-orange-500 w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Total Matches</p>
                <p className="text-2xl font-bold text-orange-500">{donorHistory.length + recipientHistory.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Donor History Section */}
        <div className='space-y-4'>
          <h2 className="text-xl font-semibold text-gray-800">Donor History</h2>
          <Card>
            <HistoryTable data={donorHistory} type="donor" />
          </Card>
        </div>

        {/* Recipient History Section */}
        <div className='space-y-4'>
          <h2 className="text-xl font-semibold text-gray-800">Recipient History</h2>
          <Card>
            <HistoryTable data={recipientHistory} type="recipient" />
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="px-4 py-2 text-sm bg-white border border-orange-200 text-orange-500 rounded-md hover:bg-orange-50">
          Export Records
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-white border border-orange-200 rounded-md hover:bg-orange-50">
            Previous
          </button>
          <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;
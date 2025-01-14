import React, { useEffect, useState } from 'react';
import { Calendar, User, Heart, Activity } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant }) => {
  const variants = {
    matched: 'bg-green-100 text-green-800',
    inProgress: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

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

const MatchHistory = () => {
  const [matchList, setMatchList] = useState([
    {
      id: 1,
      date: '2025-01-10',
      donor: 'Kelly',
      recipient: 'George',
      organType: 'Kidney',
      hospital: 'City General Hospital',
      status: 'Matched',
      bloodType: 'B+'
    },
    {
      id: 2,
      date: '2025-01-09',
      donor: 'Anonymous Donor',
      recipient: 'Patient #1235',
      organType: 'Liver',
      hospital: 'Memorial Medical Center',
      status: 'In Progress',
      bloodType: 'O+'
    },
    {
      id: 3,
      date: '2025-01-08',
      donor: 'Anonymous Donor',
      recipient: 'Patient #1228',
      organType: 'Heart',
      hospital: 'State University Hospital',
      status: 'Matched',
      bloodType: 'A-'
    }
  ])

  useEffect(()=>{
    try {
      axios.get("/match-history")
      .then((response)=>{
        if(response.data.status){
          setMatchList(response.data.data);
        }
      })
      .catch((error)=>{
        console.log("Error fetching donor history, ERROR: ", error);
      })
    } catch (error) {
      console.log("Error fetching donor history, ERROR: ", error);
    }
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
                <p className="text-2xl font-bold text-orange-500">{matchList.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Match Date</Th>
              <Th>Organ Type</Th>
              <Th>Donor Name</Th>
              <Th>Recipient Name</Th>
              <Th>Blood Type</Th>
              <Th>Hospital</Th>
            </tr>
          </thead>
          <tbody>
            {
              matchList.map((match) => (
              <tr key={match._id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    {match.organType}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    {match.recipient}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    {match.donor}
                  </div>
                </Td>
                <Td>{match.bloodType}</Td>
                <Td>{match.hospital}</Td>
                {/* <Td>
                  <Badge variant={getStatusVariant(match.status)}>
                    {match.status}
                  </Badge>
                </Td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

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
import React, { useEffect, useState } from 'react';
import { Building2, Users, HandshakeIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom'
import { format } from "date-fns";
import axios from 'axios';

const StatCard = ({ icon: Icon, title, count, iconBackground }) => (
  <div className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm">
    <div className={`${iconBackground} p-3 rounded-full`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-semibold mt-1">{count}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    donations: 0,
    recipients: 0,
    matches: 0
  });
  const [activity, setActivity] = useState([]);

  useEffect(()=>{
    (async()=>{
      try {
        await axios.get("/api/v1/hospitals/get-stats")
        .then((response)=>{
          if(response.data.success){
            setStats({
              donations: response.data.data.donationCount,
              recipients: response.data.data.receiverCount,
              matches: response.data.data.matchCount,
            })
          }
        })
        .catch((error)=>{
          console.log("Error fetching Hospital Stats, ERROR: ", error);
        })

        await axios.get("/api/v1/hospitals/get-activity")
        .then((response)=>{
          if(response.data.success){
            setActivity(response.data.data);
          }
        })
        .catch((error)=>{
          console.log("Error fetching Hospital Stats, ERROR: ", error);
        })
      } catch (error) {
        console.log("Error fetching Hospital Stats, ERROR: ", error);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of organ donation statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Building2}
          title="Donation Count"
          count={stats.donations}
          iconBackground="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Receiver Count"
          count={stats.recipients}
          iconBackground="bg-green-500"
        />
        <StatCard
          icon={HandshakeIcon}
          title="Match Count"
          count={stats.matches}
          iconBackground="bg-orange-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activity.length > 0 ? (
                activity.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.activity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                        `}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No Recent Activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavLink to="/donors" className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Add New Donor</h3>
            <p className="text-sm text-gray-500 mt-1">Register a new organ donor</p>
          </NavLink>
          <NavLink to="/recipients" className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Add Recipient</h3>
            <p className="text-sm text-gray-500 mt-1">Register a new recipient</p>
          </NavLink>
          <NavLink to="/match-history" className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">View Matches</h3>
            <p className="text-sm text-gray-500 mt-1">Check current matches</p>
          </NavLink>
          <button className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Generate Report</h3>
            <p className="text-sm text-gray-500 mt-1">Create activity report</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
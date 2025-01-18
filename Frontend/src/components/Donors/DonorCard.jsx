import React, { useState, useEffect } from 'react'
import { Trash2, ChevronDown, ChevronUp, Check, X, LogIn } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

function DonorCard({
    status, 
    fullName, 
    age, 
    bloodType, 
    organType, 
    id,
    donorList,
    setDonorList
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [donorStatus, setDonorStatus] = useState(status);
    

    useEffect(() => {
        (async () => {
            try {
                await axios.get(`/api/v1/hospitals/donor/get-requests/${id}`)
                .then((response)=>{
                    if(response.data.success){
                        setRequestList(response.data.data);
                    }
                })
                .catch((error)=>{
                    console.log('Request List fetching failed, ERROR: ', error);
                });
            } catch (error) {
                console.log('Request List fetching failed, ERROR: ', error);
            }
        })();

    }, []);
    
    return (
        <div className="relative">
            <div className="min-w-[50rem] bg-gray-100 border rounded-xl border-black/10 text-lg font-serif min-h-[10rem] p-8 flex justify-between">
                <div>
                    <h3 className="text-xl font-semibold">{fullName}</h3>
                    <p>Age: {age}</p>
                    <p>Blood Group: {bloodType}</p>
                    <p>Organ Type: {organType}</p>
                </div>
                <div className="flex flex-col items-end justify-center">
                    {donorStatus === "available" 
                        ? <CrossButton id={id} isOpen={isOpen} setIsOpen={setIsOpen} donorList={donorList} setDonorList={setDonorList}/>
                        : <CheckButton id={id} isOpen={isOpen} setIsOpen={setIsOpen} donorList={donorList} setDonorList={setDonorList}/>
                    }
                </div>
            </div>
            
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-6">
                        <h4 className="font-semibold mb-2 ">Recent Requests</h4>
                        <div className="space-y-3">
                            {requestList.length>0 ? 
                                (requestList
                                .filter(item => item.status === "Accepted")
                                .map((item, index) => (
                                    <RequestItem 
                                    key={item._id || index} 
                                    recipientName={item.recipient.fullName || 'Unknown'}
                                    hospitalName={item.hospital?.name || 'Unknown'}
                                    date={item.recipient.createdAt ? format(new Date(item.recipient.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                    status={item.status}
                                    recipient_id={item.recipient._id}
                                    donor_id={id}
                                    donorStatus={donorStatus}
                                    setDonorStatus={setDonorStatus}
                                    />
                                )))
                                : <p className='text-red-600 font-normal font-serif '>No Requests as of now</p>
                            }
                            {
                                requestList
                                .filter(item => item.status !== "Accepted")
                                .map((item, index) => (
                                    <RequestItem 
                                        key={item._id || index} 
                                        recipientName={item.recipient.fullName || 'Unknown'}
                                        hospitalName={item.hospital?.name || 'Unknown'}
                                        date={item.recipient.createdAt ? format(new Date(item.recipient.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                        status={item.status}
                                        recipient_id={item.recipient._id}
                                        donor_id={id}
                                        donorStatus={donorStatus}
                                        setDonorStatus={setDonorStatus}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function RequestItem({ 
    recipientName, 
    hospitalName, 
    date, 
    status,
    setDonorStatus, 
    recipient_id, 
    donor_id 
}) {
    
    const [requestStatus, setRequestStatus] = useState(status);
    let statusColor = requestStatus === "Pending" ? "text-yellow-600" : "text-red-600";
    if(requestStatus=="Accepted") statusColor="text-green-600"

    const handleAccept = () => {
        try {
            axios.patch(`/api/v1/hospitals/donor/accept-request`,{
              recipient_id,
              donor_id,
            })
            .then((response)=>{
              if(response.data.success){
                console.log("Request accepted");
                setRequestStatus("Accepted");
                setDonorStatus("unavailable");
              }
            })
        } catch (error) {
            console.log("Error while accepting request, Error: ", error);
        }
    };

    const handleReject = () => {
        try {
            axios.patch(`/api/v1/hospitals/donor/reject-request/${id}`,{
                status:"Rejected",
            })
            .then((response)=>{
              if(response.data.success){
                  console.log("Request rejected");
                  setRequestStatus("Rejected");
              }
            })
        } catch (error) {
            console.log("Error while accepting request, Error: ", error);
        }
    };
    
    return (
        <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
            <div>
                <p className="font-medium">{recipientName}</p>
                <p className="text-sm text-gray-600">{hospitalName}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm text-gray-600">{date}</p>
                    <p className={`text-sm font-medium ${statusColor}`}>{status}</p>
                </div>
                {
                    requestStatus=="Pending" && 
                    <div className="flex gap-2">
                        <button
                          onClick={handleAccept}
                          className="w-6 h-6 bg-green-100 hover:bg-green-200 transition-colors rounded flex items-center justify-center"
                          title="Accept Request"
                        >
                          <Check size={14} className="text-green-600" />
                        </button>
                        <button
                          onClick={handleReject}
                          className="w-6 h-6 bg-red-100 hover:bg-red-200 transition-colors rounded flex items-center justify-center"
                          title="Reject Request"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}


function CheckButton({ id, isOpen, setIsOpen}) {

    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                Status: matched 
                <span className="text-4xl font-extrabold text-green-600">✓</span>
            </div>
            <div className="flex items-end space-x-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                    Request History
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
        </div>
    )
}

function CrossButton({ id, isOpen, setIsOpen, donorList, setDonorList  }) {
    // console.log(donorList);
    
    const deleteDonor = async()=>{
        try {
            await axios.delete(`/api/v1/hospitals/donor/delete/${id}`)
            .then((response)=>{
                if(response.data.success){
                    const newDonorList = donorList.filter((item)=> item._id!=id)
                    console.log(newDonorList);
                    
                    setDonorList(newDonorList);
                }
            })
            .catch((error)=>{
                console.log("Error while deleting the donor, ERROR: ", error);
            })
        } catch (error) {
            console.log("Error while deleting the donor, ERROR: ", error);
        }
    }

    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                Status: unmatched 
                <span className="text-4xl font-extrabold text-red-600">×</span>
            </div>
            <div className="flex items-end space-x-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                    Requests
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <button 
                    type="button"
                    className="bg-red-600 hover:bg-red-700 transition-colors w-8 h-8 flex justify-center items-center rounded-md text-white"
                    onClick={deleteDonor}
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    )
}

export default DonorCard
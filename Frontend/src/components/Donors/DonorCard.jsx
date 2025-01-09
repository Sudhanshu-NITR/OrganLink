import React from 'react'
import { NavLink } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

function DonorCard({status="available", fullName, age, bloodType, organType, id}) {
    return (
        <> 
            <div className='min-w-[50rem] bg-gray-100 border rounded-xl border-black/10 text-lg font-serif min-h-[10rem] p-8 flex justify-between'>
                <div>
                    <h3 className='text-xl font-semibold'>{fullName}</h3>
                    <p>Age: {age}</p>
                    <p>BloodGroup: {bloodType}</p>
                    <p>Organ Type: {organType}</p>
                </div>
                <div className='flex flex-col items-end justify-center'>
                    {status==="available" 
                    ? <Cross id={id}/>
                    : <Check id={id}/>
                    }
                </div>
            </div>
        </>
    )
}

function Check({id}){
    return(
        <>
            Status: matched <p className='text-4xl font-extrabold text-green-600'>&#x2713;</p>
            <NavLink to={`/request-history/:${id}`}>
                <button
                    type="submit"
                    className='px-4 w-full py-2 rounded-lg bg-blue-400 text-white'
                >Request History</button>
            </NavLink>
        </>     
    )
}

function Cross({id}){
    return(
        <>
            Status: unmatched <p className='text-4xl font-extrabold text-red-600'>{'\u00D7'}</p>
            <div className='flex items-end space-x-4'>
                <NavLink to={`/recipient-details/:${id}`}>
                    <button
                        type="submit"
                        className='px-4 w-full py-2 rounded-lg bg-blue-400 text-white'
                    >Requests</button>
                </NavLink>
                <button className='bg-red-600 w-8 h-8 flex justify-center items-center border-black rounded-md'><Trash2 /></button>
            </div>
        </>
    )
}

export default DonorCard

import React from 'react'

function DonorCard({status="available", fullName, age, bloodType, organType}) {
    return (
        <> 
            <div className='min-w-[40rem] bg-gray-100 border rounded-xl border-black/10 text-lg font-serif min-h-[10rem] p-8 flex justify-between'>
                <div>
                    <h3 className='text-xl font-semibold'>Jonh Doe</h3>
                    <p>Age: {age}</p>
                    <p>BloodGroup: {bloodType}</p>
                    <p>Organ Type: {organType}</p>
                </div>
                <div className='flex flex-col items-end justify-center'>
                    {status==="available" ? <Cross />:<Check />}
                    
                </div>
            </div>
        </>
    )
}

function Check(){
    return(
        <>
            Status: matched <p className='text-4xl font-extrabold text-green-600'>&#x2713;</p>
            <button
                type="submit"
                className='px-4 w-full py-2 rounded-lg bg-blue-400 text-white'
            >Request History</button>
        </>
    )
}

function Cross(){
    return(
        <>
            Status: unmatched <p className='text-4xl font-extrabold text-red-600'>{'\u00D7'}</p>
            <button
                type="submit"
                className='px-4 w-full py-2 rounded-lg bg-blue-400 text-white'
            >Requests</button>
        </>
    )
}

export default DonorCard

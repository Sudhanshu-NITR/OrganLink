import { Recipient } from '../models/recipient.models.js';
import { Donor } from '../models/donor.models.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const sendRequest = asyncHandler(async(req, res)=>{
    const {fullName, age, bloodType, organNeeded, phone, email, donor_id} = req.body;
    const hospital = req.hospital._id
    if(
        [fullName, age, bloodType, organNeeded, phone, email, donor_id].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }
    const existingRequest = await Donor.findOne({
        $and: [{fullName, organNeeded}]
    });

    if(existingRequest){
        throw new ApiError(409, "Requests already exists");
    }

    const recipient = await Recipient.create({
        fullName, 
        age, 
        bloodType, 
        organNeeded, 
        urgency,
        status: "unmatched",
        hospital,
        donor: donor_id
    })
    
    const request = await Donor.findByIdAndUpdate(
        donor_id,
        {
            $push: {
                requests: recipient._id
            }
        },
        { new: true }
    );

    if(!recipient || !request){
        throw new ApiError("Error generating request!!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Request sent"
        )
    )
});

const searchDonors = asyncHandler(async(req, res)=>{
    const {organType, bloodGroup, age} = req.query;
    
    if(!organType || !bloodGroup || !age){
        throw new ApiError(409, "Search Parameters were not passed!!");
    }

    const searchResults = await Donor.aggregate([
        {
            $match: {
                organType: organType,
                status: "available"
            }
        },
        {
            $addFields: {
                isBloodGroupMatch: {
                    $eq: ["$bloodGroup", bloodGroup] //Boolean value
                },
                ageDifference: {
                    $abs: { $subtract: ["$age", parseInt(age)] }
                }
            }
        },
        {
            $sort: { 
                isBloodGroupMatch: -1,   //true comes first
                ageDifference: 1   //smaller difference first
            }
        },
        {
            $lookup:{
                from: "hospitals",
                localField: "hospital",
                foreignField: "_id",
                as: "hospital"
            }
        }
        
    ]);

    if(!searchResults){
        throw new ApiError(500, "Error while aggregating search results!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            searchResults,
            "Search results successfully fetched!!"
        )
    )
})

const recipientList = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    
    if(!hospital){
        throw new ApiError(401, "User unauthorized");
    }
    const hospital_id = hospital._id;
    

    const recipients = await Recipient.aggregate([
        {
            $match: {
                hospital: hospital_id,
            },
        },
        {
            $addFields: {
                sortStatus: { $cond: [{ $eq: ["$status", "matched"] }, 1, 0] },
            },
        },
        {
            $sort: {
                sortStatus: 1, 
                createdAt: -1, 
            },
        },
    ]);

    if(!recipients){
        throw new ApiError(409, "Error while collecting recipient data");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            recipients,
            "recipient list fetched successfully"
        )
    );
});

export {
    sendRequest,
    searchDonors,
    recipientList
}
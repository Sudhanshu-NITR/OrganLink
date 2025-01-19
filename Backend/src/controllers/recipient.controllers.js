import { Recipient } from '../models/recipient.models.js';
import { Donor } from '../models/donor.models.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const sendRequest = asyncHandler(async(req, res)=>{
    const {fullName, age, bloodType, organNeeded, phone, email, donor_id} = req.body;
    const hospital = req.hospital._id
    console.log(req);
    
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
        status: "unmatched",
        hospital,
        donor: donor_id
    })
    const request = await Donor.findByIdAndUpdate(
        donor_id,
        {
            $push: {
                requests: {
                    recipient: recipient._id
                }
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
    const {organType, bloodType, age} = req.query;
    // console.log(req.query);
    
    if(!organType || !bloodType || !age){
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
                isBloodTypeMatch: {
                    $eq: ["$bloodType", bloodType] //Boolean value
                },
                ageDifference: {
                    $abs: { $subtract: ["$age", parseInt(age)] }
                }
            }
        },
        {
            $sort: { 
                isBloodTypeMatch: -1,   //true comes first
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
        },
        {
            $addFields: {
                hospital: { $first: "$hospital" }
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

const deleteRecipient = asyncHandler(async(req, res)=>{
    const {id} = req.params;

    if(!id){
        throw new ApiError(400, "Recipient id was not passed!!");
    }

    const recipient = await Recipient.findByIdAndDelete(id).select("-password");

    if(!recipient){
        throw new ApiError(500, "Something went wrong while deleting the recipient")
    }

    const donor = await Donor.findByIdAndUpdate(
        recipient.donor,
        {
            $pull: {
                requests: {
                    recipient: recipient._id,
                }
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            recipient,
            "Recipient deleted successfully!!"
        )
    )
})

export {
    sendRequest,
    searchDonors,
    recipientList,
    deleteRecipient
}
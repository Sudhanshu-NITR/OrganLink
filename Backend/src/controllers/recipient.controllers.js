import { Recipient } from '../models/recipient.models.js';
import { Donor } from '../models/donor.models.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { Hospital } from '../models/hospital.models.js';

const addRecipient = asyncHandler(async(req, res)=>{
    const {hospital_id} = req.params;
    let {fullName, age, bloodType, organNeeded, urgency} = req.body;

    if(
        [fullName, age, bloodType, organNeeded, urgency].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existingRequest = await Recipient.findOne({
        $or: [{fullName, organNeeded}]
    });

    if(existingRequest){
        throw new ApiError(409, "Request already exists");
    }

    const hospital = await Hospital.findById(hospital_id).select(
        "email phone name address"
    );

    const recipient = await Recipient.create({
        fullName, 
        age, 
        bloodType, 
        organNeeded, 
        urgency,
        status: "unmatched",
        hospital
    });

    if(!recipient){
        throw new ApiError(500, "Something Went Wrong while preparing the request");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            recipient, 
            "Recipient request registered successfully"
        )
    )

}); 

const findMatches = asyncHandler(async(req, res)=>{
    const {organNeeded, bloodType} = req.body;
    
    if(!organNeeded || !bloodType){
        throw new ApiError(400, "Recipient information invalid");
    }

    const matches = await Donor.aggregate([
        {
            $match: { 
                bloodType, 
                organType: organNeeded, 
                status: 'available' 
            }
        },
        {
            $lookup: {
                from: 'hospitals', 
                localField: 'hospital', 
                foreignField: '_id', 
                as: 'hospitalDetails' 
            }
        },
        { 
            $project: { 
                name: 1, 
                age: 1, 
                organType: 1, 
                bloodType: 1, 
                hospitalDetails: { 
                    name: 1, 
                    location: 1 
                } 
            }
        }
    ]);

    if(!matches){
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "No matches found!")
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            matches, 
            "match found"
        )
    );

});

const sendRequest = asyncHandler(async(req, res)=>{
    const { donor } = req.body;

    if(!donor){
        throw new ApiError(400, "donor fetching uncesuccessfull");
    }

    const request = await Donor.findByIdAndUpdate(
        donor._id,
        {
            $push: {
                requests: recipientId
            }
        },
        { new: true }
    );

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
    const {organType, bloodGroup, age} = req.body;

    if(!organType || !bloodGroup || !age){
        throw new ApiError(409, "Search Parameters wwere not passed!!");
    }

    const searchResults = await Donor.aggregate([
        {
            $match: {
                organType: organType,
                status: "unmatched"
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

export {
    addRecipient,
    findMatches,
    sendRequest,
    searchDonors
}
import { Donor } from "../models/donor.models.js";
import { Recipient } from "../models/recipient.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { Hospital } from "../models/hospital.models.js";
import { Match } from "../models/match.models.js"
import mongoose from 'mongoose';
import { request } from "http";

const addDonor = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    let {fullName, age, bloodType, organType} = req.body;

    if(
        [fullName, age, bloodType, organType].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }
    // console.log(hospital);
    
    const existingRequest = await Donor.findOne({
        $and: [{fullName, organType}]
    });

    if(existingRequest){
        throw new ApiError(409, "Donor already exists");
    }

    const donor = await Donor.create({
        fullName, 
        age, 
        bloodType, 
        organType, 
        status: "available",
        hospital,
        requests: [],
    });

    if(!donor){
        throw new ApiError(500, "Something Went Wrong while creating Donor profile");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            donor, 
            "Donor registered successfully"
        )
    )
});

const getRequests = asyncHandler(async(req, res)=>{
    const { donor_id } = req.params;

    if(!donor_id){
        throw new ApiError(409, "Failed to fetch donor id");
    }

    const donor = await Donor.findById(new mongoose.Types.ObjectId(donor_id.toString().trim()));
    
    if(!donor){
        throw new ApiError(409, "Failed to fetch donor details");
    }

    const requests = donor.requests;
    // console.log(requests);
    
    const requestList = await Promise.all(
        requests.map(async (request) => {
            // console.log(request);
            
            const recipient = await Recipient.findById(request.recipient);
            const hospital = await Hospital.findById(recipient.hospital);
            return {
                ...request.toObject(),
                recipient: recipient,
                hospital: hospital
            };
        })
    );
    
    requests.length = 0; 

    return res
    .status(200)
    .json(
        new ApiResponse(200,
        requestList,
        "Requests fetched successfully")
    )
});

const acceptRequest = asyncHandler(async(req, res)=>{
    const { donor_id, recipient_id } = req.body;
    const donorHospital = req.hospital;
    
    if(!donor_id || !recipient_id){
        throw new ApiError(400, "Error while receiving donor & receiver data");
    }
    
    const donor = await Donor.findById(donor_id)

    if(donor.status === 'unavailable'){
        throw new ApiError(409, "organ already donated");
    }
    
    const existingMatch = await Match.findOne({
        $or: [{ recipient_id }, { donor_id }]
    })

    if(existingMatch){
        throw new ApiError(400, "Match already exists or organ already donated!!")
    }
    
    const updatedRequests = await donor.requests.map((request) => ({
        ...request.toObject(),
        status: request.recipient.toString() === recipient_id.toString() 
            ? "Accepted" 
            : "Rejected"
    }));
    
    const updatedDonor = await Donor.findByIdAndUpdate(
        donor._id,
        {
            $set: {
                status: "unavailable",
                recipient: recipient_id,
                requests: updatedRequests
            }
        },
        { new: true }
    );

    const updatedRecipient = await Recipient.findByIdAndUpdate(
        recipient_id,
        {
            $set: {
                status: "matched",
                donorHospital:{
                    name: donorHospital.name,
                    phone: donorHospital.phone,
                    address: donorHospital.address
                }
            }
        },
        { new: true }
    ).select("-password");
    
    const recipientHospital = await Hospital.findById(updatedRecipient.hospital);
    const match = await Match.create({
        donor: updatedDonor._id,
        recipient: updatedRecipient._id,
        donorHospital,
        recipientHospital
    });

    if(!match){
        throw new ApiError(500, "Error while creating match entry");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                match,
                updatedDonor,
                updatedRecipient
            },
            "Match created successfully"
        )
    );
});

const rejectRequest = asyncHandler(async(req, res)=>{
    const {donor_id, recipient_id} = req.body;
    
    if(!donor_id || !recipient_id){  
        throw new ApiError(400, "donor id or recipient id was not passed");
    }

    const donor = await Donor.findByIdAndUpdate(
        donor_id,
        {
            $set: {
                "requests.$[elem].status": "Rejected",  // $ matches the array index found in the query
            }
        },
        { 
            new: true ,
            arrayFilters: [{ "elem.recipient": recipient_id }]
        }
    ).select("-password")

    const recipient = await Recipient.findByIdAndUpdate(
        recipient_id,
        {
            $set: {
                status: "rejected"
            }
        },
        { new: true }
    )

    if(!donor){
        throw new ApiError(409, "Error while updating donor reject request!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            donor,
            "Request rejected successfully!!"
        )
    )

})

const donorList = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    
    if(!hospital){
        throw new ApiError(401, "User unauthorized");
    }
    const hospital_id = hospital._id;
    

    const donors = await Donor.aggregate([
        {
            $match: {
                hospital: hospital_id,
            },
        },
        {
            $addFields: {
                // Assign 0 to "available" and 1 to "unavailable"
                sortStatus: { $cond: [{ $eq: ["$status", "unavailable"] }, 1, 0] },
            },
        },
        {
            $sort: {
                sortStatus: 1, // Available first 
                createdAt: -1, // Most recent donors first
            },
        },
    ]);

    if(!donors){
        throw new ApiError(409, "Error while collecting donors data");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            donors,
            "donor list fetched successfully"
        )
    );
});

const deleteDonor = asyncHandler(async(req, res)=>{
    const {id} = req.params;

    if(!id){
        throw new ApiError(400, "Donor id was not passed!!");
    }

    const donor = await Donor.findByIdAndDelete(id).select("-password");

    if(!donor){
        throw new ApiError(500, "Something went wrong while deleting the donor")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            donor,
            "Donor deleted successfully!!"
        )
    )

});

export { addDonor, acceptRequest, getRequests, donorList, rejectRequest, deleteDonor };
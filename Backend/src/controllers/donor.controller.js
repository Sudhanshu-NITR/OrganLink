import { Donor } from "../models/donor.models.js";
import { Recipient } from "../models/recipient.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { Hospital } from "../models/hospital.models.js";
import { Match } from "../models/match.models.js"
import { Mongoose } from 'mongoose';
import { log } from "node:console";

const addDonor = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    let {fullName, age, bloodType, organType} = req.body;

    if(
        [fullName, age, bloodType, organType].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existingRequest = await Donor.findOne({
        $or: [{fullName, organType}]
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
        hospital
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
    const {donor} = req.body;

    if(!donor){
        throw new ApiError(409, "Failed to fetch donor details");
    }
    const requests = donor.requests;
    const requestList = await Donor.findById(donor._id).populate({
        path: 'requests.recipient'
    });

    const modifiedRequestList = await Donor.aggregate([
        {
            $match:{
                _id: donor._id,
            }
        },
        {
            $lookup: {
                from: "hospitals", 
                localField: "hospital", 
                foreignField: "_id", 
                as: "hospital" 
            }
        },
        {
            $unwind: "$hospital"
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(200,
        modifiedRequestList,
        "Requests fetched successfully")
    )
});

const acceptRequest = asyncHandler(async(req, res)=>{
    const {donor, recipient} = req.body;

    if(!donor || !recipient){
        throw new ApiError(400, "Error while retrieving donor & reciever data");
    }

    if(donor.status=='unavailable'){
        throw new ApiError(409, "organ already donated");
    }

    const match = await Match.create({
        donor: donor._id,
        recipient: recipient._id
    });

    if(!match){
        throw new ApiError(500, "Error while creating match entry");
    }

    await Donor.findByIdAndUpdate(
        donor._id,
        {
            status: "unavailable"
        }
    )

    await Recipient.findByIdAndUpdate(
        recipient._id,
        {
            status: "matched"
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            match,
            "Match created successfully"
        )
    );
});

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

export { addDonor, acceptRequest, getRequests, donorList };
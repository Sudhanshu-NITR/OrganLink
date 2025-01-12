import { Donor } from "../models/donor.models.js";
import { Recipient } from "../models/recipient.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { Hospital } from "../models/hospital.models.js";
import { Match } from "../models/match.models.js"
import mongoose from 'mongoose';

const addDonor = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    let {fullName, age, bloodType, organType} = req.body;

    if(
        [fullName, age, bloodType, organType].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }

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
    
    const requestList = await Promise.all(
        requests.map(async (request) => {
            const recipient = await Recipient.findById(request.recipient);
            const hospital = await Hospital.findById(request.recipient.hospital);
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
    const {donor_id, recipient_id} = req.body;

    if(!donor_id || !recipient_id){
        throw new ApiError(400, "Error while retrieving donor & reciever data");
    }

    const donor = await Donor.findById(donor_id)
    const recipient = await Recipient.findById(recipient_id)

    if(!donor || !recipient){
        throw new ApiError(400, "Error while retrieving donor & reciever data");
    }

    if(donor.status=='unavailable'){
        throw new ApiError(409, "organ already donated");
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
        donor_id,
        {
            $set: {
                status: "unavailable"
            }
        },
        {new: true}
    ).select("-password");

    const updatedRecipient = await Recipient.findByIdAndUpdate(
        recipient_id,
        {
            $set: {
                status: "matched"
            }
        },
        {new: true}
    ).select("-password");
    

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

    if(!donor_id || recipient_id){  
        throw new ApiError(400, "donor id and recipient id was not passed");
    }

    const donor = await Donor.findByIdAndUpdate(
        { 
            _id: donor_id, // first this
            "requests.recipient": recipient_id // then this
        },
        {
            $set: {
                "requests.$.status": "Accepted",  // $ matches the array index found in the query
            }
        },
        { new: true }
    ).select("-password")

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

    const donor = Donor.findByIdAndDelete(id, (error, docs)=>{
        if(error){
            throw new ApiError(500, "Something went wrong while deleting the donor")
        }
        else{
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    docs,
                    "Donor deleted successfully!!"
                )
            )
        }
    });

});

export { addDonor, acceptRequest, getRequests, donorList, rejectRequest, deleteDonor };
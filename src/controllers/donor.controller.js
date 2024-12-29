import { Donor } from "../models/donor.models.js";
import { Recipient } from "../models/recipient.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { Hospital } from "../models/hospital.models.js";
import { Match } from "../models/match.models.js"

const addDonor = asyncHandler(async(req, res)=>{
    const {hospital_id} = req.params;
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

    const hospital = await Hospital.findById(hospital_id).select(
        "email phone name address"
    );

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
            {
                match,
            },
            "Match created successfully"
        )
    );
});

export { addDonor, acceptRequest };
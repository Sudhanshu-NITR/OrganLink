import { Donor } from "../models/donor.models.js";
import {asyncHandler} from "../utils/asyncHandler"
import { Recipient } from "../models/recipients.models.js";

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

    const donor = Donor.create({
        fullName, 
        age, 
        bloodType, 
        organType, 
        status: "available",
        hospital: hospital_id
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
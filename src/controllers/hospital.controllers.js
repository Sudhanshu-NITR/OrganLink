import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { Hospital } from '../models/hospital.models.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';

const registerHospital = asyncHandler( async (req, res) =>{
    
    // get hospital details from frontend
    const {name, contactInfo, password} = req.body;
    console.log("email: ", contactInfo.email);
    
    // validation-not empty
    if(
        [name, contactInfo.email, contactInfo.phone, password].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }
    
    // check if user already exists: name, email
    const existingUser = User.findOne({
        $or: [{name, email}]
    })
    
    if(existingUser){
        throw new ApiError(409, "Hospital with same name or email already exists")
    }
    
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0].path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    
    // upload them to cloudinary
    const avatar = uploadOnCloudinary(avatarLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }
    
    // create user object - create entry in db
    const hospital = await Hospital.create({
        name, 
        avatar: avatar.url,
        contactInfo,
        password,
    })
    
    // remove password & refresh token field from response
    const createdHospital = await hospital.findById(hospital._id).select(
        "-password -refreshToken"
    )
    
    // check for user creation
    if(!createdHospital){
        throw new ApiError(500, "Something Went Wrong while registering the Hospital");
    }
    
    // return response
    return res.status(201).json(
        new ApiResponse(200, createdHospital, "Hospital Registered Successfully")
    )
});

export {registerHospital};
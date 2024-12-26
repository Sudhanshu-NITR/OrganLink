import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { Hospital } from '../models/hospital.models.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';

const registerHospital = asyncHandler( async (req, res) =>{
    
    // get hospital details from frontend
    let {name, contactInfo, password, location, address} = req.body;
    contactInfo = JSON.parse(contactInfo);
    const email = contactInfo.email;
    const phone = contactInfo.phone;
    // console.log("email: ", email);

    // validation-not empty
    if(
        [name, email, phone, password, location, address].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }
    // console.log(req.body);
    // console.log(req.files);
    
    
    // check if user already exists: name, email
    const existingHospital = await Hospital.findOne({
        $or: [{ name }, { location }]
    });
    if(existingHospital){
        throw new ApiError(409, "Hospital with same name or email already exists")
    }
    
    // check for images, check for avatar
    // console.log(req.files?.avatar[0].path)
    const avatarLocalPath = req.files?.avatar[0].path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    
    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar failed to upload on Cloudinary");
    }
    
    // create user object - create entry in db
    const hospital = await Hospital.create({
        name, 
        avatar: avatar.url,
        contactInfo,
        password,
        location,
        address
    })
    
    // remove password & refresh token field from response
    const createdHospital = await Hospital.findById(hospital._id).select(
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
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { Hospital } from '../models/hospital.models.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (hospitalId) =>{
    try {
        const hospital = await Hospital.findById(hospitalId);
        const accessToken = hospital.generateAccessToken();
        const refreshToken = hospital.generateRefreshToken();
        
        
        hospital.refreshToken = refreshToken;
        await hospital.save({validateBeforeSave: false})

        return { accessToken, refreshToken }
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating Refresh & Access Tokens")
    }
}

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
        $or: [{ name }, { location }, { email }]
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

const loginHospital = asyncHandler( async (req, res) =>{
    const {contactInfo, password} = req.body;
    // contactInfo = JSON.parse(contactInfo);
        
    const email = contactInfo.email;
    const phone = contactInfo.phone;
    if(email=="" && phone==""){
        throw new ApiError(400, "Email id OR Phone no. is required!!");
    }
    const hospital = await Hospital.findOne({
        $or: [{email}, {phone}]
    })

    if(!hospital){
        throw new ApiError(404, "Hospital entry does not exist");
    }

    const isPasswordValid = await hospital.isPasswordCorrect(password);
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Hospital credentials");
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(hospital._id);

    const loggedIn = await Hospital.findById(hospital._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    } // Cookies are modifiable by anyone so we use this options object which makes it modifiable only by the server now

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                hospital: loggedIn, accessToken, refreshToken
            },
            "Hospital logged in Successfully"
        )
    )
    
});

const logoutHospital = asyncHandler( async (req, res)=>{
    await Hospital.findByIdAndUpdate(
        req.hospital._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "Hospital logged out Successfully")
    )
});

const refreshAcessToken = asyncHandler( async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            proccess.env.REFRESH_TOKEN_SECRET
        )
    
        const hospital = Hospital.findById(decodedToken?._id);
        if(!hospital){
            throw new ApiError(401, "Invalid Refresh Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is invalid or expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateRefreshAndAccessToken(hospital._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    accessToken, 
                    refreshToken: newRefreshToken
                },
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }

});

export {
    registerHospital, 
    loginHospital, 
    logoutHospital, 
    refreshAcessToken
};
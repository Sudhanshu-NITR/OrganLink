import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { Hospital } from '../models/hospital.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import { Recipient } from '../models/recipient.models.js';
import { Donor } from '../models/donor.models.js';
import { Match } from '../models/match.models.js';
import mongoose from 'mongoose';


const generateRefreshAndAccessToken = async(hospitalId)=>{
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

const registerHospital = asyncHandler(async(req, res)=>{
    
    // get hospital details from frontend
    const {name, email, phone, password, address} = req.body;

    // validation-not empty
    if(
        [name, email, phone, password, address].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required");
    }
    
    
    // check if user already exists: name, email
    const existingHospital = await Hospital.findOne({
        $or: [{ name }, { email }]
    });
    if(existingHospital){
        throw new ApiError(409, "Hospital with same name or email already exists")
    }

    const timestart = Date.now();
    
    // check for images, check for avatar
    // console.log(req.file)
    const avatarLocalPath = req.files?.avatar[0].path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    
    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // console.log("Uploaded: ", Date.now() - timestart);

    if(!avatar){
        throw new ApiError(400, "Avatar failed to upload on Cloudinary");
    }
    
    const avatarUrl = avatar.url

    // create user object - create entry in db
    const hospital = await Hospital.create({
        name, 
        avatar: avatarUrl,
        email,
        phone,
        password,
        // location,
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
    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            createdHospital, 
            "Hospital Registered Successfully"
        )
    )
});

const loginHospital = asyncHandler(async(req, res)=>{
    const {email, phone, password} = req.body;
    // console.log("Hi");
    
    if(email==="" && phone===""){
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

const logoutHospital = asyncHandler(async(req, res)=>{
    await Hospital.findByIdAndUpdate(
        req.hospital._id,
        {
            $unset: {
                refreshToken: 1
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

const refreshAcessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const hospital = Hospital.findById(decodedToken?._id);
        if(!hospital){
            throw new ApiError(401, "Invalid Refresh Token");
        }
    
        if(incomingRefreshToken !== hospital?.refreshToken){
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

const getCurrentHospital = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        req.hospital,
        "current hospital fetched successfully"
    ))
});

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {currentPassword, newPassword} = req.body;
    const hospital = await Hospital.findById(req.hospital?._id);
    
    const isPasswordCorrect = await hospital.isPasswordCorrect(currentPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password");
    }

    hospital.password = newPassword;
    await hospital.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changes successfully"
    ));
});

const updateProfileDetails = asyncHandler(async(req, res)=>{
    const {name, email, phone, address} = req.body;
    
    if(!name || !email || !phone || !address){
        throw new ApiError(400, "All fields are required");
    }

    const hospital = await Hospital.findByIdAndUpdate(
        req.hospital._id,
        {
            $set: {
                name,
                email,
                phone,
                address
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        hospital,
        "Account details updated successfully"
    ))
    
});

const updateHospitalAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar");
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
        req.hospital?._id,
        { 
            $set: { 
                avatar: avatar.secure_url 
            } 
        }, 
        { new: true }
    );

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedHospital,
        "Avatar updated successfully"
    ));
});


const getRecentActivity = asyncHandler(async (req, res) => {
    const hospital_id = mongoose.isValidObjectId(req.hospital._id)
    ? new mongoose.Types.ObjectId(req.hospital._id)
    : req.hospital._id;

    const [donors, recipients, matches] = await Promise.all([
        Donor.aggregate([
            { $match: { hospital: hospital_id } },
            { $project: { date: '$updatedAt', activity: { $literal: 'New Donor registered' }, status: { $literal: "Completed" }, type: { $literal: 'donor' } } },
            { $sort: { updatedAt: -1 } },
            { $limit: 5 }
        ]),
        Recipient.aggregate([
            { $match: { hospital: hospital_id } },
            { $project: { date: '$updatedAt', activity: { $literal: 'New Request added' }, status: { $literal: "Successful" }, type: { $literal: 'recipient' } } },
            { $sort: { updatedAt: -1 } },
            { $limit: 5 }
        ]),
        Match.aggregate([
            { 
                $match: { 
                    $or: [
                        { donorHospital: hospital_id },
                        { recipientHospital: hospital_id }
                    ] 
                } 
            },
            { $project: { date: '$updatedAt', activity: { $literal: 'Match found Successfully' }, status: { $literal: "Matched" }, type: { $literal: 'match' } } },
            { $sort: { updatedAt: -1 } },
            { $limit: 5 }
        ])
    ]);

    const activity = [...donors, ...recipients, ...matches]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            activity, 
            "Recent Activity successfully fetched!!"
        )
    );
});



const getStats = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;
    const donationCount =  await Donor.countDocuments({hospital: hospital._id});
    const receiverCount =  await Recipient.countDocuments({hospital: hospital._id});
    const matchCount = await Match.countDocuments({
        $or: [
            {recipientHospital: hospital._id},
            {donorHospital: hospital._id}
        ]
    })

    if(donationCount==null || receiverCount==null || matchCount==null){
        throw new ApiError(409, "Failed to fetch data from database!!"); 
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                donationCount,
                receiverCount,
                matchCount,
            },
            "Dashboard data successfully fetched"
        )
    )
});

export {
    registerHospital, 
    loginHospital, 
    logoutHospital, 
    refreshAcessToken,
    changeCurrentPassword,
    getCurrentHospital,
    updateProfileDetails,
    updateHospitalAvatar,
    getStats,
    getRecentActivity
};
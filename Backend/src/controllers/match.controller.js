import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import { Match } from '../models/match.models.js';

const getMatchesHistory = asyncHandler(async(req, res)=>{
    const hospital = req.hospital;

    if(!hospital._id){
        throw new ApiError(400, "Hospital Id invalid")
    }

    const donors = await Match.aggregate([
        {
            $lookup:{
                from: "donors",
                localField: "donor",
                foreignField: "_id",
                as: "donorDetails"
            },
        },
        {
            $addFields: {
                donorDetails: {
                    $first: "$donorDetails"
                }
            }
        },
        {
            $match:{
                "donorDetails.hospital": new mongoose.Types.ObjectId(hospital._id)
            }   
        },
        {
            $lookup:{
                from: "recipients",
                localField: "recipient",
                foreignField: "_id",
                as: "recipientDetails"
            },
        },
        {
            $addFields: {
                recipientDetails: {
                    $first: "$recipientDetails"
                }
            }
        }
    ]);

    const recipients = await Match.aggregate([
        {
            $lookup:{
                from: "recipients",
                localField: "recipient",
                foreignField: "_id",
                as: "recipientDetails"
            },
        },
        {
            $addFields: {
                recipientDetails: {
                    $first: "$recipientDetails"
                }
            }
        },
        {
            $match:{
                "recipientDetails.hospital": new mongoose.Types.ObjectId(hospital._id)
            }   
        },
        {
            $lookup:{
                from: "donors",
                localField: "donor",
                foreignField: "_id",
                as: "donorDetails"
            },
        },
        {
            $addFields: {
                donorDetails: {
                    $first: "$donorDetails"
                }
            }
        }
    ])

    if(!donors || !recipients){
        throw new ApiError("400", "database aggregation error!!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                donors,
                recipients
            },
            "Match History fetched successfully"
        )
    )
});

export {getMatchesHistory}
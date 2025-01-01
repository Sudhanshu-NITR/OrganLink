import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { Mongoose } from 'mongoose';

const getMatchesHistory = asyncHandler(async(req, res)=>{
    const {hospital_id} = req.body;

    if(!hospital_id){
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
                hospital: new Mongoose.Types.ObjectId(hospital_id)
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
        },
        {
            $project: {
                donorDetails: 1,
                recipientDetails: 1
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
                hospital: new Mongoose.Types.ObjectId(hospital_id)
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
        },
        {
            $project: {
                donorDetails: 1,
                recipientDetails: 1
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
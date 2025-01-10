import mongoose, {Schema} from "mongoose";
import { Recipient } from "./recipient.models.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const donorSchema = new Schema(
    {
        fullName:{
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        bloodType: {
            type: String,
            required: true,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        organType: {
            type: String,
            required: true,
            index: true,
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['available', 'unavailable'],
            default: 'available',
        },
        requests: {
            type: [{
                recipient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Recipient',
                },
                status: {
                    type: String,
                    enum: ['Accepted', 'Rejected', 'Pending'],
                    default: 'Pending',
                },
            }],
            default: [],
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipient'
        }
    }, 
    {timestamps: true}
);

donorSchema.plugin(mongooseAggregatePaginate);

export const Donor = mongoose.model("Donor", donorSchema)
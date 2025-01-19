import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const recipientSchema = new Schema(
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
        organNeeded: {
            type: String,
            required: true,
            index: true,
        },
        urgency: {
            type: Number, // 1 = most urgent, 5 = least urgent
            // required: true,
            default: 1,
            min: 1,
            max: 5,
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['matched', 'unmatched', 'rejected'],
            default: 'unmatched',
        },
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor',
            required: true
        }
    },
    {timestamps: true}
);

recipientSchema.plugin(mongooseAggregatePaginate);

export const Recipient = mongoose.model("Recipient", recipientSchema);
import mongoose, {Schema} from "mongoose";

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
            required: true,
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
            enum: ['matched', 'unmatched'],
            default: 'unmatched',
        },
    },
    {timestamps: true}
);

export const Recipient = mongoose.model("Recipient", recipientSchema);
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const matchSchema = Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor',
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipient',
            required: true,
        },
        donorHospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true
        },
        recipientHospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'completed'],
            default: 'pending',
        },
    }, {timestamps: true}
)

matchSchema.plugin(mongooseAggregatePaginate);

export const Match = mongoose.model("Match", matchSchema);
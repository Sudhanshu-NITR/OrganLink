import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const hospitalSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        address:{
            type: String,
            required: true
        },
        avatar:{
            type: String,   //cloudinary url
            required: true,
        },
        location: {
            type: String
        },
        phone: { 
            type: String, 
            required: true,
            index: true,
            unique: true,
        },
        email: { 
            type: String, 
            required: true, 
            index: true,
            unique: true 
        },
        password: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
)

hospitalSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

hospitalSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

hospitalSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

hospitalSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

hospitalSchema.plugin(mongooseAggregatePaginate);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
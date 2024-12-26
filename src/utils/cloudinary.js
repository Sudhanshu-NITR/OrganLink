import fs from "fs"
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!fileLocalPath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        console.log("file is uploaded on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the file from local system if it cannot be uploaded

        return null;
    }
}

export {uploadOnCloudinary}
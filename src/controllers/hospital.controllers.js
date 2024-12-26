import {asyncHandler} from '../utils/asyncHandler.js'

const registerHospital = asyncHandler( async (req, res) =>{
    res.status(200).json({
        message: "ok",
    });
});

export {registerHospital};
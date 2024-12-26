import { Router } from "express";
import { registerHospital } from "../controllers/hospital.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/register",).post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerHospital
)


export default router;
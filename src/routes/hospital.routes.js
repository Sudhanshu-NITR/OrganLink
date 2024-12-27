import { Router } from "express";
import { loginHospital, logoutHospital, registerHospital, refreshAcessToken } from "../controllers/hospital.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerHospital
)

router.route("/login").post(loginHospital);

//secured routes
router.route("/logout").post(verifyJWT, logoutHospital);
router.route("/refresh-token").post(refreshAcessToken);


export default router;
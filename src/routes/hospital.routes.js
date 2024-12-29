import { Router } from "express";
import { loginHospital, logoutHospital, registerHospital, refreshAcessToken, getCurrentHospital, changeCurrentPassword, updateAccountDetails, updateHospitalAvatar } from "../controllers/hospital.controllers.js";
import { getMatchesHistory } from "../controllers/match.controller.js";
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

//secured routes
router.route("/login").post(loginHospital);
router.route("/logout").post(verifyJWT, logoutHospital);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentHospital);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateHospitalAvatar);
router.route("/match-history").get(getMatchesHistory)

import recipientRouter from "./recipient.routes.js";
import donorRouter from "./donor.routes.js";

router.use("/recipient", recipientRouter);
router.use("/donor", donorRouter);

export default router;
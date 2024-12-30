import { Router } from "express";
import { acceptRequest, addDonor, getRequests } from "../controllers/donor.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/add-donor/:hospital_id").post(addDonor);
router.route("/get-requests").get(getRequests);
router.route("/accept-request").post(acceptRequest);

export default router;
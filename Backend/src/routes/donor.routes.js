import { Router } from "express";
import { acceptRequest, addDonor, donorList, getRequests } from "../controllers/donor.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/add-donor").post(addDonor);
router.route("/get-requests").get(getRequests);
router.route("/accept-request").post(acceptRequest);
router.route("/donors").get(donorList);

export default router;
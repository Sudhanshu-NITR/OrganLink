import { Router } from "express";
import { addDonor } from "../controllers/donor.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT)

router.route("/add-donor/:hospital_id").post(addDonor);

export default router;
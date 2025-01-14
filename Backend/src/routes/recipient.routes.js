import { Router } from "express";
import { recipientList, searchDonors, sendRequest } from "../controllers/recipient.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router.route("/send-request").post(sendRequest);
router.route("/search-donors").get(searchDonors);
router.route("/recipients").get(recipientList);

export default router;
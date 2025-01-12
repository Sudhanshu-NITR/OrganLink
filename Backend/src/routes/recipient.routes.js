import { Router } from "express";
import { addRecipient, findMatches, searchDonors, sendRequest } from "../controllers/recipient.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router.route("/add-recipient/:hospital_id").post(addRecipient);
router.route("/find-matches").get(findMatches);
router.route("/send-request").post(sendRequest);
router.route("/search-donors").get(searchDonors);

export default router;
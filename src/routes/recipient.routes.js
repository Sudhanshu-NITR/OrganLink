import { Router } from "express";
import { addRecipient, matchRecipient } from "../controllers/recipient.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router.route("/add-recipient/:hospital_id").post(addRecipient);
router.route("/match-request").get(matchRecipient);

export default router;
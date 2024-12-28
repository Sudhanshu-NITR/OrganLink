import { Router } from "express";
import { addRecipient, matchRecipient } from "../controllers/recipient.controllers.js"

const router = Router();

router.route("/add-recipient").post(addRecipient);
router.route("/match-requests").get(matchRecipient);

export default router;
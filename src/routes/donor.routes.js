import { Router } from "express";
import { addDonor} from "../controllers/donor.controllers.js"

const router = Router();

router.route("/add-donor").post(addDonor);

export default router;
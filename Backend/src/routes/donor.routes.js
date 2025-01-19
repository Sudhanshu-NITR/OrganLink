import { Router } from "express";
import { acceptRequest, addDonor, deleteDonor, donorList, getRequests, rejectRequest } from "../controllers/donor.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/add-donor").post(addDonor);
router.route("/get-requests/:donor_id").get(getRequests);
router.route("/accept-request").patch(acceptRequest);
router.route("/reject-request").patch(rejectRequest);
router.route("/donors").get(donorList);
router.route("/delete/:id").delete(deleteDonor)

export default router;
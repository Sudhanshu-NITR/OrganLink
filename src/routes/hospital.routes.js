import { Router } from "express";
import { registerHospital } from "../controllers/hospital.controllers.js";

const router = Router();

router.route("/register",).post(registerHospital)

export default router;
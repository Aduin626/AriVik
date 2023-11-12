import express from "express";
import Controller from "../controllers/auth.js";

const router = express.Router();

router.post("/login", Controller.login);
router.post("/register", Controller.registerPatient);

export default router;

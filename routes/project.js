import express from "express";
import Controller from "../controllers/project.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.post("/project-add", authenticateToken, Controller.addProject);
router.get("/project", authenticateToken, Controller.getProject);
router.delete("/project/:id", authenticateToken, Controller.deleteProject);
router.put("/project/:id", authenticateToken, Controller.editProject);

export default router;

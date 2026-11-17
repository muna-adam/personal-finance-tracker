

import express from "express";

import { register, login, getProfile, } from "../controllers/authController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// router.get("/profile", protect, getProfile);
router.get("/profile", protect, async (req, res) => { await new Promise(resolve => setTimeout(resolve, 1000)); res.json(res.user) });

export default router;


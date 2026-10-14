
import express from "express";

import protect from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

import {getAllUsers,getUserById,deleteUser,getAdminStats,} from "../controllers/adminController.js";

const router = express.Router();


router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

export default router;

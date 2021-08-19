import express from "express";
import "express-async-errors";
import * as authController from "../controller/auth.js";

const router = express.Router();

// GET,POST /auth
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export default router;

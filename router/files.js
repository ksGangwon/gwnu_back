import express from "express";
import * as filesController from "../controller/files.js";

const router = express.Router();

// file download
router.get("/:originalFileName", filesController.download);

export default router;

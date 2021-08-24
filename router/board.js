import express from "express";
import "express-async-errors";
import * as boardController from "../controller/board.js";
import { upload } from "../module/multer.js";

const router = express.Router();

// board
router.get("/", boardController.getBoard);
router.get("/:id", boardController.getBoardId);
router.post("/", upload.array("files", 4), boardController.createBoard);
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);

export default router;

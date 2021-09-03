import express from "express";
import "express-async-errors";
import * as boardController from "../controller/board.js";

const router = express.Router();

// board
router.get("/", boardController.getBoard);
router.get("/:id", boardController.getBoardId);

router.post("/file", boardController.findFile); // 중복 파일 찾기
router.post("/", boardController.createBoard); // 업로드

router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);

export default router;

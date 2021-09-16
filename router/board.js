import express from "express";
import "express-async-errors";
import * as boardController from "../controller/board.js";
import multer from 'multer';

const router = express.Router();
let upload = multer({ storage: multer.memoryStorage() });

// board
router.get("/", boardController.getBoard); // 전체 페이지
router.get("/:divide/:id", boardController.getBoardId); // 게시글 페이지

router.post("/file", boardController.findFile); // 중복 파일 찾기
router.post("/", boardController.createBoard); // 업로드

router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);
router.post('/uploadFile', upload.any(), boardController.upload);

export default router;

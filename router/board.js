import express from 'express';
import 'express-async-errors';
import * as boardController from '../controller/board.js';

const router = express.Router();

// GET /board
router.get('/', boardController.getBoard);

router.post('/', (req, res, next) => {
  res.status(201).json(data);
});

router.put('/', (req, res, next) => {
  res.status(201).json(data);
});

router.delete('/', (req, res, next) => {
  res.status(204);
});

export default router;
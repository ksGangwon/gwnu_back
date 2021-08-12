import * as boardRepository from '../data/board.js';

export async function getBoard(req, res) {
  const data = await boardRepository.getAll();
  res.status(200).json(data);
}
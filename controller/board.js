import * as boardRepository from "../data/board.js";

export async function getBoard(req, res) {
  const data = await boardRepository.getAll();
  res.status(200).json(data);
}

export async function getBoardId(req, res) {
  const id = req.params.id;
  const board = await boardRepository.getById(id);
  if (board) {
    res.status(200).json(board);
  } else {
    res.status(404).json({ message: `Board id(${id}) not found` });
  }
}

export async function createBoard(req, res) {
  const { title, description, category, image, file } = req.body; // 빈 변수 db저장 안됨
  const board = await boardRepository.create(
    title,
    description,
    category,
    image,
    file
  );
  res.status(201).json(board);
}

export async function updateBoard(req, res) {
  const id = req.params.id;
  let { title, description, category, image, file } = req.body; // 빈 변수 db저장 안됨
  const board = await boardRepository.getById(id);
  if (!board) {
    return res.status(404).json({ message: `Board not found: ${id}` });
  }
  if (board.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await boardRepository.update(
    id,
    title,
    description,
    category,
    image,
    file
  );
  res.status(200).json(updated);
}

export async function deleteBoard(req, res) {
  const id = req.params.id;
  const board = await boardRepository.getById(id);
  if (!board) {
    return res.status(404).json({ message: `Board not found: ${id}` });
  }
  await boardRepository.remove(id);
  res.sendStatus(204);
}

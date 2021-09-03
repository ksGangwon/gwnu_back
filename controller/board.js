import * as boardRepository from "../data/board.js";

export async function getBoard(req, res) {
  // Pagings
  let { page } = req.body; // 1페이지는 0, 2페이지는 1, ...
  console.log("choose page: ", page);
  if(page === undefined) {
    page = 0;
  }
  page = parseInt(page)*10;
  page = page + "";
  const data = await boardRepository.paging(page);
  console.log(data);
  res.status(200).json(data);
}

export async function getBoardId(req, res) {
  const id = req.params.id;
  const board = await boardRepository.getById(id);
  const files = await boardRepository.aws_getById(id);
  let arr = [board, files];
  if (board) {
    res.status(200).json(arr);
  } else {
    res.status(404).json({ message: `Board id(${id}) not found` });
  }
}

export async function findFile(req, res) {
  console.log("findFile: ", req.body);
  const originalname = req.body.originalname;
  const check = await boardRepository.find(originalname);
  console.log(check);
  if(check) {
    res.status(200);
  } else {
    res.status(404).json({ message: '이미 존재하는 파일명입니다.' });
  }
}

// notice create
export async function createBoard(req, res) {
  const { title, description, category, file } = req.body;
  const board = await boardRepository.create(title, description, category);
  const lastId = await boardRepository.lastId();
  const id = lastId.id;
  if (file.length) {
    for (let i = 0; i < file.length; i++) {
      let originalname = file[i].originalname;
      let url = file[i].url;
      await boardRepository.aws_create(id, originalname, url);
    }
  }
  res.status(201).json(board);
}

export async function updateBoard(req, res) {
  const id = req.params.id;
  let { title, description, category } = req.body; // 빈 변수 db저장 안됨
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
    category
  );
  res.status(200).json(updated);
}

export async function deleteBoard(req, res) {
  const id = req.params.id;
  const board = await boardRepository.getById(id);
  if (!board) {
    return res.status(404).json({ message: `Board not found: ${id}` });
  }
  // aws 객체 삭제
  const file = await boardRepository.aws_keyValue(id);
  params.Delete.Objects = file;
  s3.deleteObjects(params, function (err, data) {
    if (err) console.log("삭제시 에러: " + err, err.stack);
    else console.log("삭제: ", data); // successful response
  });
  await boardRepository.remove(id);
  res.sendStatus(204);
}

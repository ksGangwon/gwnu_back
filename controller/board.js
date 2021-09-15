import * as boardRepository from "../data/board.js";
import AWS from "aws-sdk";
import path from "path";
const __dirname = path.resolve();
AWS.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new AWS.S3();

export async function getBoard(req, res) {
  let { page, category, divide } = req.query;
  let data;
  console.log("page: ", page);
  console.log("category: ", category);
  page = parseInt(page)*10;
  page = page + "";

  if(category == "all") {
    data = await boardRepository.paging(page, divide);
  } else {
    data = await boardRepository.categoryPage(category, page, divide);
  }
  res.status(200).json(data);
}

export async function getBoardId(req, res) {
  const id = req.params.id;
  await boardRepository.inquiry(id);
  const board = await boardRepository.getById(id);
  const files = await boardRepository.aws_getById(id);
  const other = await boardRepository.otherBoard(id);
  let data = [board, files, other];
  if (board) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Board id(${id}) not found` });
  }
}

export async function findFile(req, res) {
  console.log("findFile: ", req.body);
  const originalname = req.body.originalname;
  const check = await boardRepository.find(originalname);
  console.log(check.length)
  if(check.length==0){
    res.status(200).json({ success: '같은 이름의 파일이 존재하지 않습니다.' });
  } else {
    res.status(200).json({ fail: '이미 같은 이름의 파일이 존재합니다.' });
  }
}

// notice create
export async function createBoard(req, res) {
  const { title, description, category, divide, file, url } = req.body;
  const date = now();
  const board = await boardRepository.create(title, description, category, date, divide);
  const lastId = await boardRepository.lastId();
  const id = lastId.id;
  if(file){
    if (file.length) {
      for (let i = 0; i < file.length; i++) {
        let originalname = file[i];
        let fileurl = url[i];
        await boardRepository.aws_create(id, originalname, fileurl);
      }
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
  s3_delete(id); // aws 객체 삭제
  await boardRepository.remove(id);
  res.sendStatus(204);
}

export async function upload(req, res) {
  console.log('업로드 성공')
  res.status(200).json(req.files[0]);
}

function now() {
  let dt = new Date();
  let str = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
  return str;
}

async function s3_delete(id) {
  let params = {
    Bucket: "gwnu", 
    Delete: { Objects: null, Quiet: false, },
  };
  const filesKeyValue = await postsRepository.filesKeyValue(id);
  params.Delete.Objects = filesKeyValue;
  s3.deleteObjects(params, function(err, data) {
    if (err) console.log("삭제시 에러: " + err, err.stack); // an error occurred
    else console.log("삭제: ", data);  // successful response
  });
}
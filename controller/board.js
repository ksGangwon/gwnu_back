import * as boardRepository from "../data/board.js";
import util from "../module/util.js";
import aws from "aws-sdk";
import path from "path";
const __dirname = path.resolve();
aws.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new aws.S3();

let params = {
  Bucket: "gwnu",
  Delete: {
    Objects: null,
    Quiet: false,
  },
};

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

// notice create
export async function createBoard(req, res) {
  let test = JSON.parse(req.body.test); // json key이름 : test
  const { title, description, category } = test;
  const board = await boardRepository.create(title, description, category);
  const lastId = await boardRepository.lastId();
  const id = lastId.id;
  const files = req.files;
  //console.log(image[0].originalname);
  //const path = image.map((img) => img.location);
  if (files.length) {
    for (let i = 0; i < files.length; i++) {
      let original = files[i].originalname;
      let key = "notice/" + files[i].key;
      let versionId = files[i].versionId;
      let url = files[i].location;
      await boardRepository.aws_create(id, original, key, versionId, url);
    }
    //return res.status(200);
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
  const file = await boardRepository.aws_getById(id);
  params.Delete.Objects = file;
  s3.deleteObjects(params, function (err, data) {
    if (err) console.log("삭제시 에러: " + err, err.stack);
    else console.log("삭제: ", data); // successful response
  });
  await boardRepository.remove(id);
  res.sendStatus(204);
}

import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM notice").then((result) => result[0]);
}

export async function paging(page) {
  return db
    .execute("SELECT * FROM notice ORDERS LIMIT ?, 10;", [page])
    .then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM notice WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function aws_getById(id) {
  return db
    .execute("SELECT original, url FROM notice_file WHERE id=?", [id])
    .then((result) => result[0]);
}

export async function aws_keyValue(id) {
  return db
    .execute("SELECT KeyName as 'Key', VersionId FROM notice_file WHERE id=?", [
      id,
    ])
    .then((result) => result[0]);
}

export async function getJoin(id) {
  return db
    .execute(
      "SELECT nt.id, nt.title, nt.description, nt.category, nt.date, file.original, file.url FROM notice as nt JOIN notice_file as file ON nt.id=file.id WHERE nt.id=?",
      [id]
    )
    .then((result) => result[0]);
}

export async function create(title, description, category) {
  return db
    .execute(
      "INSERT INTO notice (title, description, category) VALUES(?, ?, ?)",
      [title, description, category]
    )
    .then((result) => getById(result[0].insertId));
}

export async function aws_create(id, originalname, url) {
  console.log(url)
  return db
    .execute(
      "INSERT INTO notice_file (id, originalname, url) VALUES(?, ?, ?)",
      [id, originalname, url]
    )
    .then((result) => getById(result[0].insertId));
}

export async function update(id, title, description, category) {
  return db
    .execute(
      "UPDATE notice SET title=?, description=?, category=? WHERE id=?",
      [title, description, category, id]
    )
    .then(() => getById(id));
}

export async function remove(id) {
  return (
    db.execute("DELETE FROM notice WHERE id=?", [id]),
    db.execute("DELETE FROM notice_file WHERE id=?", [id])
  );
}

export async function lastId() {
  return db
    .execute("SELECT id FROM notice order by id desc limit 1")
    .then((result) => result[0][0]);
}

export async function find(originalname) {
  console.log(originalname)
  return db
    .execute("SELECT * FROM notice_file WHERE originalname=?", [originalname])
    .then((result) => result[0]);
}
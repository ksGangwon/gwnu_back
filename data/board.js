import { db } from "../db/database.js";

// export async function getAll() {
//   return db.execute("SELECT * FROM notice").then((result) => result[0]);
// }

export async function paging(divide, page) {
  return db
    .execute(`SELECT *
              FROM (SELECT
                @ROWNUM := @ROWNUM+1 as number, T.*
                FROM notice T, (SELECT @ROWNUM := 0) TMP
                ORDER BY id ASC) SUB
              WHERE divide = ?
              ORDER BY SUB.number DESC LIMIT ?, 10`, [divide, page])
    .then((result) => result[0]);
}

export async function categoryPage(category, page) {
  return db
    .execute(`SELECT * FROM (SELECT @ROWNUM := @ROWNUM+1 as number, T.* 
                FROM notice T, (SELECT @ROWNUM := 0) TMP 
                ORDER BY id ASC) SUB 
              WHERE category = ?
              ORDER BY SUB.number DESC LIMIT ?, 10`, [category, page])
    .then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM notice WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function otherBoard(divide, id) {
  return db
    .execute(`SELECT * FROM notice WHERE id IN (
      (SELECT id FROM notice WHERE divide=? AND id < ? ORDER BY id DESC LIMIT 1),
      (SELECT id FROM notice WHERE divide=? AND id > ? ORDER BY id LIMIT 1)
      )`, [ divide, id, divide, id ])
    .then((result) => result[0]);
}

export async function aws_getById(id) {
  return db
    .execute("SELECT originalname, url FROM notice_file WHERE id=?", [id])
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

export async function create(title, description, category, date, divide) {
  return db
    .execute(
      "INSERT INTO notice (title, description, category, date, divide) VALUES(?, ?, ?, ?, ?)",
      [title, description, category, date, divide]
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

export async function inquiry(id) {
  return db
    .execute(
      "UPDATE notice SET inquiry = inquiry+1 WHERE id=?",
      [id]
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
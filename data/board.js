import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM notice").then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM notice WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function aws_getById(id) {
  return db
    .execute("SELECT KeyName as 'Key', VersionId FROM notice_file WHERE id=?", [
      id,
    ])
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

export async function aws_create(id, original, key, versionId, url) {
  return db
    .execute(
      "INSERT INTO notice_file (id, original, KeyName, VersionId, url) VALUES(?, ?, ?, ?, ?)",
      [id, original, key, versionId, url]
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

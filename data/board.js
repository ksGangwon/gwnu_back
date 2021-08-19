import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM notice").then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM notice WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function create(title, description, category, image, file) {
  return db
    .execute(
      "INSERT INTO notice (title, description, category, image, file) VALUES(?, ?, ?, ?, ?)",
      [title, description, category, image, file]
    )
    .then((result) => getById(result[0].insertId));
}

export async function update(id, title, description, category, image, file) {
  return db
    .execute(
      "UPDATE notice SET title=?, description=?, category=?, image=?, file=? WHERE id=?",
      [title, description, category, image, file, id]
    )
    .then(() => getById(id));
}

export async function remove(id) {
  return db.execute("DELETE FROM notice WHERE id=?", [id]);
}

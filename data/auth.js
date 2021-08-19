import { db } from "../db/database.js";

export async function findById(user) {
  const { id, password } = user;
  return db
    .execute("SELECT * FROM auth WHERE id=?", [id])
    .then((result) => result[0]);
}

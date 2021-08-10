import { db } from '../db/database.js';

export async function getAll() {
  return db
    .execute('SELECT * FROM board')
    .then((result) => result[0]);
}
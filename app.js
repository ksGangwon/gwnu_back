import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import boardRouter from './router/board.js';
import authRouter from './router/auth.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/board', boardRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});
  
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(8080);
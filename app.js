import express from 'express';
import cors from 'cors';
//import bodyParser from 'body-parser';
import postRouter from './router/post.js';

const app = express();

app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());

app.use('/posts', postRouter);

app.listen(8080);
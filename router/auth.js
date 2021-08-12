import express from 'express';
import 'express-async-errors';
import * as authController from '../controller/auth.js';

const router = express.Router();

// POST /auth
router.post('/login', authController.login);

export default router;
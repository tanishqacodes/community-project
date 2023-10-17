import express from "express";

import * as authController from '../controllers/Auth.Controller';

import { verifyJWTMiddleware } from '../utils/jwt';
const router = express.Router();

router.post('/signup',authController.signup);
router.post('/signin',authController.login);
router.get('/me',verifyJWTMiddleware,authController.me);

export default router;


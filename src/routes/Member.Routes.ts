import express from "express";
import { verifyJWTMiddleware } from "../utils/jwt";
import memberController from "../controllers/Member.Controller";
const router = express.Router();

router.post('/add',verifyJWTMiddleware,memberController.addMember);
// router.delete('/:id',verifyJWTMiddleware,memberController.deleteMember);

export default router;
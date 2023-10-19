import express from "express";
import roleController from "../controllers/Role.Controller";

const router = express.Router();

router.post('/create',roleController.create);
router.get('/getall',roleController.getAll);
export default router;
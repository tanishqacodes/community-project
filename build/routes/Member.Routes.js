"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../utils/jwt");
const Member_Controller_1 = __importDefault(require("../controllers/Member.Controller"));
const router = express_1.default.Router();
router.post('/add', jwt_1.verifyJWTMiddleware, Member_Controller_1.default.addMember);
router.delete('/:id', jwt_1.verifyJWTMiddleware, Member_Controller_1.default.deleteMember);
exports.default = router;

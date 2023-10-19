"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Role_Controller_1 = __importDefault(require("../controllers/Role.Controller"));
const router = express_1.default.Router();
router.post('/create', Role_Controller_1.default.create);
router.get('/getall', Role_Controller_1.default.getAll);
exports.default = router;

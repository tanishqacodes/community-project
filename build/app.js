"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./config/db");
const Auth_Routes_1 = __importDefault(require("./routes/Auth.Routes"));
const app = (0, express_1.default)();
// middleware
app.use(body_parser_1.default.json());
(0, db_1.connectToDatabase)();
// router
app.use('/v1/auth', Auth_Routes_1.default);
// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

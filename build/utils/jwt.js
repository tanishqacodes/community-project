"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWTMiddleware = exports.verifyJWT = exports.generateJWT = void 0;
const secret_1 = require("../config/secret");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
    }, secret_1.JWT_SECRET, {
        expiresIn: '3h',
    });
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    try {
        const user = jsonwebtoken_1.default.verify(token, secret_1.JWT_SECRET);
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
const verifyJWTMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    // const decodedToken = jwt.decode(token);
    // if(!decodedToken){
    //     return res.status(401).json({
    //         success : false,
    //         error : "Unauthorized"
    //     });
    // }
    // console.log("decoded token : ",decodedToken);
    // const { id, name ,  email , created_at } = decodedToken as User;
    // decode data to request object
    // req.user = {
    //     id,
    //     name,
    //     email,
    //     created_at,
    // };
    // console.log("req.user ",req.user);
    // token verification
    const user = (0, exports.verifyJWT)(token);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    req.user = user;
    // console.log("user : ",user);
    next();
};
exports.verifyJWTMiddleware = verifyJWTMiddleware;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const User_Interface_1 = require("../interfaces/User.Interface");
const db_1 = require("../config/db");
const jwt_1 = require("../utils/jwt");
const bcrypt = __importStar(require("bcrypt"));
const authController = {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                console.log('user : ', user);
                const isUserValid = (0, User_Interface_1.validateUser)(user);
                if (isUserValid.length > 0) {
                    return res.status(400).json({
                        success: false,
                        error: isUserValid
                    });
                }
                var user_ = yield (0, User_Interface_1.registerUser)(user.name, user.email, user.password);
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database Connection Error",
                    });
                }
                const userCollection = db.collection('users');
                const checkIfUserExists = yield userCollection.findOne({ email: user.email });
                if (checkIfUserExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'User already exists...'
                    });
                }
                const result = yield userCollection.insertOne(user_);
                const access_token = (0, jwt_1.generateJWT)(user_);
                if (result.insertedId) {
                    res.status(201).json({
                        status: true,
                        content: {
                            data: {
                                id: user_.id,
                                name: user_.name,
                                email: user_.email,
                                crated_at: user.created_at,
                            },
                            meta: {
                                access_token,
                            }
                        }
                    });
                }
                else {
                    return res.status(500).json({
                        success: false,
                        error: "something went wrong"
                    });
                }
            }
            catch (error) {
                console.log("error in signup api : ", error);
                res.status(500).json({
                    success: false,
                    error: "something went wrong"
                });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.body;
            const db = (0, db_1.getDatabase)();
            if (!db) {
                return res.status(500).json({
                    success: false,
                    error: "Database Connection error",
                });
            }
            const userCollection = db.collection('users');
            const checkIfUserExists = yield userCollection.findOne({ email: user.email });
            // console.log(checkIfUserExists);
            if (!checkIfUserExists) {
                return res.status(400).json({
                    success: false,
                    error: "User does not exists",
                });
            }
            const validatePassword = yield bcrypt.compare(user.password, checkIfUserExists.password);
            if (!validatePassword) {
                return res.status(400).json({
                    success: false,
                    error: 'Password is wrong'
                });
            }
            user = {
                id: checkIfUserExists.id,
                name: checkIfUserExists.name,
                email: checkIfUserExists.email,
                created_at: checkIfUserExists.created_at,
                password: user.password
            };
            const access_token = (0, jwt_1.generateJWT)(user);
            return res.status(200).json({
                status: true,
                content: {
                    data: {
                        id: checkIfUserExists.id,
                        name: checkIfUserExists.name,
                        email: checkIfUserExists.email,
                        created_at: checkIfUserExists.created_at
                    },
                    meta: {
                        access_token: access_token
                    }
                }
            });
        });
    },
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.user);
            const db = (0, db_1.getDatabase)();
            if (!db) {
                return res.status(500).json({
                    success: false,
                    error: "Database Connection error",
                });
            }
            const userCollection = db.collection('users');
            const checkIfUserExists = yield userCollection.findOne({ email: req.user.email });
            if (!checkIfUserExists) {
                return res.status(400).json({
                    success: false,
                    error: "User does not exists",
                });
            }
            return res.status(200).json({
                status: true,
                content: {
                    data: {
                        id: checkIfUserExists.id,
                        name: checkIfUserExists.name,
                        email: checkIfUserExists.email,
                        created_at: checkIfUserExists.created_at,
                    }
                }
            });
        });
    }
};
module.exports = authController;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.validateUser = void 0;
const { isEmail } = require('validator');
const snowflake_1 = require("../utils/snowflake");
const bcrypt_1 = require("../utils/bcrypt");
const validateUser = (user) => {
    console.log("validate user : ", user);
    if (!user.name) {
        return ["Please enter an name..."];
    }
    if (!user.email) {
        return ["Please enter an email..."];
    }
    if (!isEmail(user.email)) {
        return ['Please enter valid email....'];
    }
    if (!user.password) {
        return ['Please enter an password..'];
    }
    if (user.password.length < 7) {
        return ['Password must be atleast 6 characters'];
    }
    if (user.name.length < 3) {
        return ['Name must be atleast 3 characters'];
    }
    return [];
};
exports.validateUser = validateUser;
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        id: (0, snowflake_1.generateId)(),
        name,
        email,
        password: yield (0, bcrypt_1.hashedPassword)(password),
        created_at: new Date()
    };
});
exports.registerUser = registerUser;

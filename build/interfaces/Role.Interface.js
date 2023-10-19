"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initalizeRole = exports.validateRole = void 0;
const snowflake_1 = require("../utils/snowflake");
const validateRole = (role) => {
    console.log("validate role : ", role);
    if (role.name === null) {
        return ['Please enter role'];
    }
    if (role.name.length < 2) {
        return ['Minimum length is 2 , please enter larger role'];
    }
    return [];
};
exports.validateRole = validateRole;
const initalizeRole = (name) => {
    return {
        id: (0, snowflake_1.generateId)(),
        name,
        created_at: new Date(),
        updated_at: new Date()
    };
};
exports.initalizeRole = initalizeRole;

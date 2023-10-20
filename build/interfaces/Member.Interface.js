"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignMember = void 0;
const snowflake_1 = require("../utils/snowflake");
const assignMember = (community, user, role) => {
    return {
        id: (0, snowflake_1.generateId)(),
        community: community,
        user: user,
        role: role,
        created_at: new Date()
    };
};
exports.assignMember = assignMember;

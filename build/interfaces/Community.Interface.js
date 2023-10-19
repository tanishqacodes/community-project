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
exports.createCommunity = exports.validateCommunity = void 0;
const snowflake_1 = require("../utils/snowflake");
const slug_1 = require("../utils/slug");
const validateCommunity = (community) => {
    if (!community.name) {
        return ["name is required"];
    }
    if (community.name.length < 3) {
        return ["name must be at least 3 characters"];
    }
    return [];
};
exports.validateCommunity = validateCommunity;
const createCommunity = (name, db, req) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = yield (0, slug_1.generateUniqueSlug)(db, name);
    return {
        id: (0, snowflake_1.generateId)(),
        name: name,
        slug: slug,
        owner: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
    };
});
exports.createCommunity = createCommunity;

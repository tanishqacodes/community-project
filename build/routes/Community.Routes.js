"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Community_Controller_1 = __importDefault(require("../controllers/Community.Controller"));
const jwt_1 = require("../utils/jwt");
const Auth_Routes_1 = __importDefault(require("./Auth.Routes"));
Auth_Routes_1.default.post('/create', jwt_1.verifyJWTMiddleware, Community_Controller_1.default.create);
Auth_Routes_1.default.get('/:id/members', Community_Controller_1.default.getAllCommunityMembers);
Auth_Routes_1.default.get('/', jwt_1.verifyJWTMiddleware, Community_Controller_1.default.getAllCommunity);
Auth_Routes_1.default.get('/me/owner', jwt_1.verifyJWTMiddleware, Community_Controller_1.default.getOwnedCommunity);
Auth_Routes_1.default.get('/me/member', jwt_1.verifyJWTMiddleware, Community_Controller_1.default.getJoinedCommunity);
exports.default = Auth_Routes_1.default;

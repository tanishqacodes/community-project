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
const Role_Interface_1 = require("../interfaces/Role.Interface");
const db_1 = require("../config/db");
const roleController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = req.body;
                // console.log("role : ",role);
                const errors = (0, Role_Interface_1.validateRole)(role);
                if (errors.length > 0) {
                    return res.status(400).json({
                        success: false,
                        error: errors
                    });
                }
                let role_ = (0, Role_Interface_1.initalizeRole)(role.name);
                // console.log("role_ ",role_);
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database Connection Error",
                    });
                }
                const roleCollection = db.collection('roles');
                const checkIfRoleExists = yield roleCollection.findOne({ name: role.name });
                if (checkIfRoleExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Role already exists...'
                    });
                }
                const result = yield roleCollection.insertOne(role_);
                console.log("insertedid : ", result.insertedId);
                if (result.insertedId) {
                    res.status(201).json({
                        status: true,
                        content: {
                            data: {
                                id: role_.id,
                                name: role_.name,
                                crated_at: role_.created_at,
                                updated_at: role_.updated_at
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
                return res.status(500).json({
                    success: false,
                    error: "something went wrong"
                });
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error",
                    });
                }
                // pagination
                const pageSize = 10;
                const page = 1;
                const rolesCollection = db.collection('roles');
                const result = yield rolesCollection.find().toArray();
                if (!result) {
                    return res.status(500).json({
                        success: false,
                        error: 'Something went wrong',
                    });
                }
                // give total entry
                const total = yield rolesCollection.countDocuments();
                res.status(200).json({
                    success: true,
                    content: {
                        meta: {
                            total,
                            pages: Math.ceil(total / pageSize),
                            page,
                        },
                        data: result.map((role) => {
                            return {
                                id: role.id,
                                name: role.name,
                                created_at: role.created_at,
                                updated_at: role.updated_at
                            };
                        })
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: "Something went wrong",
                });
            }
        });
    }
};
module.exports = roleController;

import { Request, Response } from "express";
import Role, { initalizeRole, validateRole } from "../interfaces/Role.Interface";
import { getDatabase } from "../config/db";
const roleController = {
    async create(req: Request, res: Response) {
        try {
            const role: Role = req.body;
            // console.log("role : ",role);
            const errors = validateRole(role);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: errors
                });
            }
            let role_ = initalizeRole(role.name);
            // console.log("role_ ",role_);
            const db = getDatabase();
            if (!db) {
                return res.status(500).json({
                    success: false,
                    error: "Database Connection Error",
                });
            }
            const roleCollection = db.collection('roles');
            const checkIfRoleExists = await roleCollection.findOne({ name: role.name });
            if (checkIfRoleExists) {
                return res.status(409).json({
                    success: false,
                    error: 'Role already exists...'
                });
            }

            const result = await roleCollection.insertOne(role_);
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
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "something went wrong"
            });
        }
    },
    async getAll(req: Request, res: Response) {
        try {
            const db = getDatabase();
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
            const result = await rolesCollection.find().toArray();
            if (!result) {
                return res.status(500).json({
                    success: false,
                    error: 'Something went wrong',
                });
            }
            // give total entry
            const total = await rolesCollection.countDocuments();
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
                        }
                    })
                }
            });
        } catch (error) {
            return res.status(500).json({
                success : false,
                error : "Something went wrong",
            });
        }
    }
}

export = roleController;
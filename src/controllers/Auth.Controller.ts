import User, { registerUser, validateUser } from "../interfaces/User.Interface"
import { Request, Response } from "express";
import { getDatabase } from "../config/db";
import { generateJWT } from "../utils/jwt";
import * as bcrypt from 'bcrypt';

const authController = {
    async signup(req: Request, res: Response) {
        try {
            const user: User = req.body;
            console.log('user : ',user);
            const isUserValid = validateUser(user);
            if (isUserValid.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: isUserValid
                });
            }
            var user_ = await registerUser(user.name, user.email, user.password)
            const db = getDatabase();
            if (!db) {
                return res.status(500).json({
                    success: false,
                    error: "Database Connection Error",
                });
            }
            const userCollection = db.collection('users');
            const checkIfUserExists = await userCollection.findOne({ email: user.email });
            if (checkIfUserExists) {
                return res.status(409).json({
                    success: false,
                    error: 'User already exists...'
                });
            }

            const result = await userCollection.insertOne(user_);
            const access_token = generateJWT(user_);
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
        } catch (error) {
            console.log("error in signup api : ", error);
            res.status(500).json({
                success: false,
                error: "something went wrong"
            });
        }
    },

    async login(req: Request, res: Response) {
        const user: User = req.body;
        const db = getDatabase();
        if (!db) {
            return res.status(500).json({
                success: false,
                error: "Database Connection error",
            });
        }
        const userCollection = db.collection('users');
        const checkIfUserExists = await userCollection.findOne({ email: user.email });
        if (!checkIfUserExists) {
            return res.status(400).json({
                success: false,
                error: "User does not exists",
            });
        }
        const validatePassword = await bcrypt.compare(user.password, checkIfUserExists.password);
        if (!validatePassword) {
            return res.status(400).json({
                success: false,
                error: 'Password is wrong'
            });
        }
        const access_token = generateJWT(user);
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

    },
    async me(req:Request,res:Response){
        console.log(req.user);

        const db = getDatabase();
        if (!db) {
            return res.status(500).json({
                success: false,
                error: "Database Connection error",
            });
        }
        const userCollection = db.collection('users');
        const checkIfUserExists = await userCollection.findOne({ email: req.user.email });
        if (!checkIfUserExists) {
            return res.status(400).json({
                success: false,
                error: "User does not exists",
            });
        }
        return res.status(200).json({
            status : true,
            content : {
                data : {
                    id : checkIfUserExists.id,
                    name: checkIfUserExists.name,
                    email: checkIfUserExists.email,
                    created_at: checkIfUserExists.created_at,
                }
            }
        });
    }
}

export = authController;
import { getDatabase } from "../config/db";
import Member, { assignMember } from "../interfaces/Member.Interface";
import { Request, Response } from "express";

const memberController = {
    async addMember(req:Request,res:Response){
        try {
            const {community , user , role } = req.body;
            const db = getDatabase();
            if(!db){
                return res.status(500).json({
                    success : false,
                    error : "Database connection error"
                });
            }
            let communityCollection = db.collection('communities');
            let memberCollection = db.collection('member');
            let admin = await communityCollection.findOne({id : community});
            console.log("admin : ",admin);
            if(!admin){
                return res.status(400).json({
                    success : false,
                    error : "NOT_ALLOWED_ACCESS",
                });
            }
            if(admin.owner !== req.user.id){
                return res.status(400).json({
                    success : false,
                    error : "NOT_ALLOWED_ACCESS",
                });
            }
            const member = assignMember(community,user,role);
            const result = await memberCollection.insertOne(member);
            if(result.insertedId){
                return res.status(201).json({
                    status : true,
                    content : {
                        data : {
                            id : member.id,
                            community : member.community,
                            user : member.user,
                            role : member.role,
                            created_at : member.created_at
                        }
                    }
                });
            }
            return res.status(500).json({
                success : false,
                error : "Something went wrong",
            });
        } catch (error) {
            return res.status(500).json({
                success : false,
                error : "Something went wrong",
            });
        }
    },
    async deleteMember(req:Request,res:Response){
        
    }
}

export = memberController;
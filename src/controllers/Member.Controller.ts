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
        const { userId } = req.params;
        try{
            const db = getDatabase();
            if(!db){
                return res.status(500).json({
                    success : false,
                    error : "Database connection error"
                });
            }
            const memberCollection = db.collection('member');
            const memberDetails = await memberCollection.findOne({id : userId});
            if(!memberDetails){
                return res.status(404).json({
                    success : false,
                    error : 'Member not found'
                });
            }
            const result = await memberCollection.aggregate([
                {
                    $match : {
                        community : memberDetails.community
                    },
                },
                {
                    $lookup : {
                        from : 'communities',
                        localField : 'community',
                        foreignField : 'id',
                        as : 'community'
                    },
                },
                {
                    $lookup : {
                        from : 'users',
                        localField : 'user',
                        foreignField : 'id',
                        as : 'user',
                    }
                },
                {
                    $lookup : {
                        from : 'roles',
                        localField : 'role',
                        foreignField : 'id',
                        as : 'role',
                    }
                },
                {
                    $unwind : '$role'
                },
                {
                    $unwind : '$community'
                },
                {
                    $unwind : '$user'
                },
                {
                    $project : {
                        _id : 0,
                        communityId : '$community.id',
                        ownerId : '$community.owner',
                        userId : 'user.id',
                        role : 'role.name',
                    },
                },
            ]).toArray();

            if (result.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Member not found' 
                });
            }
            const memberData = result[0];
            const { ownerId, userId: memberId, role: role } = memberData;
            const requestorUserId = req.user.id;
    
            if (requestorUserId !== ownerId.id) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'NOT_ALLOWED_ACCESS' 
                });
            }
            const deleteResult = await memberCollection.deleteOne({ id: userId });
    
            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Member not found' 
                });
            }
            res.status(200).json({ 
                success: true 
            });
        }
        catch{
            res.status(500).json({ 
                success: false, 
                error: 'Something went wrong' 
            });
        }
    }
}

export = memberController;
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
const db_1 = require("../config/db");
const Member_Interface_1 = require("../interfaces/Member.Interface");
const memberController = {
    addMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { community, user, role } = req.body;
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error"
                    });
                }
                let communityCollection = db.collection('communities');
                let memberCollection = db.collection('member');
                let admin = yield communityCollection.findOne({ id: community });
                console.log("admin : ", admin);
                if (!admin) {
                    return res.status(400).json({
                        success: false,
                        error: "NOT_ALLOWED_ACCESS",
                    });
                }
                if (admin.owner !== req.user.id) {
                    return res.status(400).json({
                        success: false,
                        error: "NOT_ALLOWED_ACCESS",
                    });
                }
                const member = (0, Member_Interface_1.assignMember)(community, user, role);
                const result = yield memberCollection.insertOne(member);
                if (result.insertedId) {
                    return res.status(201).json({
                        status: true,
                        content: {
                            data: {
                                id: member.id,
                                community: member.community,
                                user: member.user,
                                role: member.role,
                                created_at: member.created_at
                            }
                        }
                    });
                }
                return res.status(500).json({
                    success: false,
                    error: "Something went wrong",
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: "Something went wrong",
                });
            }
        });
    },
    deleteMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error"
                    });
                }
                const memberCollection = db.collection('member');
                const memberDetails = yield memberCollection.findOne({ id: userId });
                if (!memberDetails) {
                    return res.status(404).json({
                        success: false,
                        error: 'Member not found'
                    });
                }
                const result = yield memberCollection.aggregate([
                    {
                        $match: {
                            community: memberDetails.community
                        },
                    },
                    {
                        $lookup: {
                            from: 'communities',
                            localField: 'community',
                            foreignField: 'id',
                            as: 'community'
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: 'id',
                            as: 'user',
                        }
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'role',
                            foreignField: 'id',
                            as: 'role',
                        }
                    },
                    {
                        $unwind: '$role'
                    },
                    {
                        $unwind: '$community'
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $project: {
                            _id: 0,
                            communityId: '$community.id',
                            ownerId: '$community.owner',
                            userId: 'user.id',
                            role: 'role.name',
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
                const deleteResult = yield memberCollection.deleteOne({ id: userId });
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
            catch (_a) {
                res.status(500).json({
                    success: false,
                    error: 'Something went wrong'
                });
            }
        });
    }
};
module.exports = memberController;

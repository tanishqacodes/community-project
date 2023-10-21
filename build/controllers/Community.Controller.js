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
const Community_Interface_1 = require("../interfaces/Community.Interface");
const db_1 = require("../config/db");
const Member_Interface_1 = require("../interfaces/Member.Interface");
const communityController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const community = req.body;
                const errors = (0, Community_Interface_1.validateCommunity)(community);
                if (errors.length > 0) {
                    return res.status(400).json({
                        success: false,
                        error: errors
                    });
                }
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error",
                    });
                }
                let communitiesCollection = db.collection('communities');
                let memberCollection = db.collection('member');
                let roleCollection = db.collection('roles');
                let checkIfCommunityExists = yield communitiesCollection.findOne({ name: community.name });
                console.log(checkIfCommunityExists);
                if (checkIfCommunityExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Community already exists'
                    });
                }
                let community_ = yield (0, Community_Interface_1.createCommunity)(community.name, db, req);
                // community_.slug = 
                console.log("community : ", community_);
                const result = yield communitiesCollection.insertOne(community_);
                if (result.insertedId) {
                    const role = yield roleCollection.findOne({ name: "Community Admin" });
                    console.log("role : ", role);
                    if (!role) {
                        return res.status(500).json({
                            success: false,
                            error: "Something Went Wrong"
                        });
                    }
                    const member = (0, Member_Interface_1.assignMember)(community_.id, req.user.id, role.id);
                    let member_ = yield memberCollection.insertOne(member);
                    console.log("member_ : ", member_);
                    if (!member_.insertedId) {
                        return res.status(500).json({
                            success: false,
                            error: "Something Went Wrong"
                        });
                    }
                    res.status(201).json({
                        status: true,
                        content: {
                            data: {
                                id: community_.id,
                                name: community_.name,
                                slug: community_.slug,
                                owner: community_.owner,
                                created_at: community_.created_at,
                                updated_at: community_.updated_at
                            }
                        }
                    });
                }
                else {
                    res.status(500).json({ success: false, error: "Something Went Wrong" });
                }
            }
            catch (error) {
                console.log("error : ", error);
                res.status(500).json({
                    success: false,
                    error: "Something Went Wrong"
                });
            }
        });
    },
    getAllCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database Connection error",
                    });
                }
                const page = 1;
                const pageSize = 10;
                const skip = (page - 1) * pageSize;
                const communitiesCollection = db.collection('communities');
                // give total entry
                const total = yield communitiesCollection.countDocuments();
                // join which user collection to get the data of owner
                const communities = yield communitiesCollection.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: 'id',
                            as: 'owner'
                        }
                    },
                    {
                        $unwind: '$owner'
                    },
                    // display
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            name: 1,
                            slug: 1,
                            created_at: 1,
                            updated_at: 1,
                            owner: {
                                name: '$owner.name',
                                email: '$owner.email',
                            }
                        }
                    }
                ]).skip(skip).limit(pageSize).toArray();
                return res.status(200).json({
                    success: true,
                    content: {
                        meta: {
                            total,
                            page,
                            pages: Math.ceil(total / pageSize)
                        }
                    },
                    data: communities
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
    getAllCommunityMembers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.params;
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error"
                    });
                }
                let memberCollection = db.collection('member');
                let memberCommunity = yield memberCollection.find({ community: communityId }).toArray();
                if (!memberCommunity) {
                    return res.status(404).json({
                        success: false,
                        error: 'Member not found in community'
                    });
                }
                const page = 1;
                const pageSize = 10;
                const skip = (page - 1) * pageSize;
                const total = memberCommunity.length;
                const members = yield memberCollection.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: 'id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'role',
                            foreignField: 'id',
                            as: 'role'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $unwind: 'role'
                    },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            community: 1,
                            user: {
                                id: '$user.id',
                                name: '$user.name',
                            },
                            role: {
                                id: '$role.id',
                                name: '$role.name'
                            },
                            created_at: 1
                        }
                    }
                ]).skip(skip).limit(pageSize).toArray();
                return res.status(200).json({
                    success: true,
                    content: {
                        meta: {
                            total,
                            page,
                            pages: Math.ceil(total / pageSize)
                        }
                    },
                    data: members
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: "Something went wrong"
                });
            }
        });
    },
    getOwnedCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error"
                    });
                }
                const communitiesCollection = db.collection('communities');
                const userCollection = db.collection('users');
                const checkIfOwnerExists = yield userCollection.findOne({ email: req.user.email });
                if (!checkIfOwnerExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Owner does not exists'
                    });
                }
                const pageSize = 10;
                const page = 1;
                const skip = (page - 1) * pageSize;
                // const total = 
                const communities = yield communitiesCollection.aggregate([
                    {
                        $match: {
                            owner: checkIfOwnerExists.id
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: 'id',
                            as: 'owner'
                        }
                    },
                    {
                        $unwind: '$owner'
                    },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            name: 1,
                            slug: 1,
                            created_at: 1,
                            updated_at: 1,
                        }
                    }
                ]).skip(skip).limit(pageSize).toArray();
                const total = communities.length;
                return res.status(200).json({
                    success: true,
                    content: {
                        meta: {
                            total,
                            page,
                            pages: Math.ceil(total / pageSize)
                        }
                    },
                    data: communities
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    error: "Something went wrong"
                });
            }
        });
    },
    getJoinedCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                if (!db) {
                    return res.status(500).json({
                        success: false,
                        error: "Database connection error"
                    });
                }
                const userCollection = db.collection('users');
                const signedInUser = yield userCollection.findOne({ email: req.user.email });
                if (!signedInUser) {
                    return res.status(404).json({
                        success: false,
                        error: "User not found"
                    });
                }
                const userId = signedInUser.id;
                const memberCollection = db.collection('member');
                const communitiesCollection = db.collection('communities');
                const userMember = yield memberCollection.find({ user: userId }).toArray();
                if (!userMember) {
                    return res.status(404).json({
                        success: false,
                        error: "Member not found"
                    });
                }
                const pageSize = 10;
                const page = 1;
                const skip = (page - 1) * pageSize;
                const total = userMember.length;
                const joinedCommunity = yield communitiesCollection.aggregate([
                    {
                        $match: {
                            id: {
                                $in: userMember.map((member) => member.community)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: 'id',
                            as: 'owner'
                        }
                    },
                    {
                        $unwind: '$owner'
                    },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            name: 1,
                            slug: 1,
                            owner: {
                                id: '$owner.id',
                                name: '$owner.name'
                            },
                            created_at: 1,
                            updated_at: 1,
                        }
                    }
                ]).skip(skip).limit(pageSize).toArray();
                return res.status(200).json({
                    success: true,
                    content: {
                        meta: {
                            total,
                            page,
                            pages: Math.ceil(total / pageSize)
                        },
                        data: joinedCommunity
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Something went wrong'
                });
            }
        });
    }
};
module.exports = communityController;

import { Request, Response } from "express";
import Community, { createCommunity, validateCommunity } from "../interfaces/Community.Interface"
import { getDatabase } from "../config/db";

const communityController = {
    async create(req: Request, res: Response) {
        try {
            const community: Community = req.body;
            const errors = validateCommunity(community);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: errors
                });
            }
            const db = getDatabase();
            if (!db) {
                return res.status(500).json({
                    success: false,
                    error: "Database connection error",
                });
            }
            let communitiesCollection = db.collection('communities');
            let checkIfCommunityExists = await communitiesCollection.findOne({ name: community.name });
            console.log(checkIfCommunityExists);
            if (checkIfCommunityExists) {
                return res.status(409).json({
                    success: false,
                    error: 'Community already exists'
                });
            }

            let community_ = await createCommunity(community.name, db, req);
            // community_.slug = 
            console.log("community : ", community_);
            const result = await communitiesCollection.insertOne(community_);
            if (result.insertedId) {
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
            } else {
                res.status(500).json({ success: false, error: "Something Went Wrong" });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Something Went Wrong"
            });
        }

    },
    async getAllCommunity(req: Request, res: Response) {
        try {
            const db = getDatabase();
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
            const total = await communitiesCollection.countDocuments();
            // join which user collection to get the data of owner
            const communities = await communitiesCollection.aggregate([
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
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Something went wrong",
            });
        }
    }
}

export = communityController;
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
                res.status(500).json({
                    success: false,
                    error: "Something Went Wrong"
                });
            }
        });
    },
};
module.exports = communityController;

import { Db } from "mongodb";
import { generateId } from "../utils/snowflake";
import { generateUniqueSlug } from "../utils/slug";

interface Community{
    id : string;
    name : string;
    slug : string;
    owner : string;
    created_at : Date;
    updated_at : Date;
}

export const validateCommunity = (community: Community): string[] => {
    if (!community.name) {
        return ["name is required"]
    }
    if (community.name.length < 3) {
        return ["name must be at least 3 characters"]
    }
    return [];

}

export const createCommunity = async(name:string,db:Db,req:any)=>{
    const slug = await generateUniqueSlug(db,name);
    return {
        id : generateId(),
        name:name,
        slug : slug,
        owner : req.user.id,
        created_at : new Date(),
        updated_at : new Date()
    }
}

export default Community
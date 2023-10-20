import { generateId } from "../utils/snowflake";

interface Member{
    id : string;
    community : string;
    user : string;
    role : string;
    created_at : Date;
}

export const assignMember = (community:string, user:string, role:string)=>{
    return {
        id:generateId(),
        community:community,
        user:user,
        role:role,
        created_at:new Date()
    }
}

export default Member
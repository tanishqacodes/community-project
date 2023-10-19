import { generateId } from "../utils/snowflake";

interface Role{
    id : string;
    name : string | null;
    created_at : Date;
    updated_at : Date;
}

export const validateRole = (role : Role) : string[] =>{
    // console.log("validate role : ",role);
    if(role.name === null){ 
        return ['Please enter role'];
    }
    if(role.name.length < 2){
        return ['Minimum length is 2 , please enter larger role'];
    }
    return [];
}

export const initalizeRole = (name:string|null)=>{
    return {
        id : generateId(),
        name,
        created_at : new Date(),
        updated_at : new Date()
    }
}
export default Role
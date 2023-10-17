const { isEmail } = require('validator');
import { generateId } from '../utils/snowflake';
import { hashedPassword } from '../utils/bcrypt';

interface User{
    id : string;
    name : string | null;
    email : string;
    password : string;
    created_at : Date;
}

export const validateUser = (user : User): string[]=>{
    console.log("validate user : ",user);
    if(!user.name){
        return ["Please enter an name..."]
    }
    if(!user.email){
        return ["Please enter an email..."]
    }
    if(!isEmail(user.email)){
        return ['Please enter valid email....']
    }
    if(!user.password){
        return ['Please enter an password..']
    }
    if(user.password.length < 7){
        return ['Password must be atleast 6 characters']
    }
    if(user.name.length < 3){
        return ['Name must be atleast 3 characters']
    }

    return []
}

export const registerUser = async (name:string | null,email:string,password:string)=>{
    return {
        id: generateId(),
        name,
        email,
        password : await hashedPassword(password),
        created_at : new Date()
    }
}

export default User

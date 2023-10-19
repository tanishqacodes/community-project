import { JWT_SECRET } from '../config/secret';
import User from '../interfaces/User.Interface';
import jwt from 'jsonwebtoken';

export const generateJWT = (user:User):string =>{
    return jwt.sign(
        {
            id : user.id,
            name : user.name,
            email : user.email,
            created_at : user.created_at,
        },
        JWT_SECRET,
        {
            expiresIn : '3h',
        }
    );
}

export const verifyJWT = (token : string) : User|null =>{
    try {
        const user = jwt.verify(token,JWT_SECRET);
        return user as User;
    } catch (error) {
        return null;
    }
}

export const verifyJWTMiddleware = (req:any , res:any,next:any)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            success : false,
            error : "Unauthorized"
        });
    }
    // const decodedToken = jwt.decode(token);
    // if(!decodedToken){
    //     return res.status(401).json({
    //         success : false,
    //         error : "Unauthorized"
    //     });
    // }
    // console.log("decoded token : ",decodedToken);
    // const { id, name ,  email , created_at } = decodedToken as User;
    // decode data to request object
    // req.user = {
    //     id,
    //     name,
    //     email,
    //     created_at,
    // };
    // console.log("req.user ",req.user);
    // token verification
    const user = verifyJWT(token);
    if(!user){
        return res.status(401).json({
            success : false,
            error : "Unauthorized"
        });
    }
    req.user = user;
    // console.log("user : ",user);
    next();
}
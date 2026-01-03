import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/env.js'
  declare global{
    namespace Express{
    interface Request {
      adminId?: string;
      userId?: string;
      role?:string
    }
}
}
export const userMiddleware = async (req:Request , res:Response , next : NextFunction)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success : false ,
            data: {
                error: "No token provided ,Again log In "
            }
        })
    }
    try{
        const decoded =  jwt.verify(token as string ,JWT_SECRET) as {id : string , role : string }  ;
        req.userId = decoded.id
        req.role = decoded.role 
        next()
    }catch(e){
        return res.status(401).json({
            success : false ,
            error: 'Invalid token and error: ' + e
        })
    }
}

export function requireRole(roles:string[]){
    return(req:Request , res:Response , next:NextFunction)=>{
        // @ts-ignore
        if(!roles.includes(req.role)){
             return res.status(403).json({ message: "Forbidden" });
        }
        next(); 
    }
}
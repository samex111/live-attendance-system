import jwt from 'jsonwebtoken'
import { type Request , type Response , type NextFunction } from 'express'
import { JWT_TEACHER } from '../config/env.js'
import { JWT_STUDENT } from '../config/env.js'
import { success } from 'zod'

export const userMiddleware = async (req:Request , res:Response , next : NextFunction)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({
            success : false ,
            data: {
                error: "No token provided ,Again log In "
            }
        })
    }
    try{
        const decoded =  jwt.verify(token as string ,JWT_STUDENT) as {id : string } ;
        req.userId = decoded.id
    }
}
// role based acess
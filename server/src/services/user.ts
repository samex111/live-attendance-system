import { ClassModel, UserModel } from "../models/schema.js";
import z, { email, success,  } from 'zod'
import jwt from 'jsonwebtoken'
import { Router , type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/env.js";
import { requireRole, userMiddleware } from "../middeleware/auth.js";

export const userRouter = Router();

userRouter.post('/signup', async(req:Request, res:Response)=>{
 
    const requireBody = z.object({
        name:z.string(),
        email:z.email(),
        password:z.string().min(6),
        role:z.enum(['teacher','student'])
    });
    const parseData = requireBody.safeParse(req.body);

        if(!parseData.success){
        return res.status(400).json({
            success:false,
            data:{
                error:"erron in zod parsing: " +  parseData.error
            }
        })
    }

    const {name , email , password , role}   = parseData.data;

    try{
       const response =  await UserModel.create({
            name:name,
            email:email,
            password:password,
            role:role
        })
        res.status(200).json({
            success:"true",
            data:{
                id:response._id,
                name:response.name,
                email:response.email,
                role:response.role
            }
        })
    } catch(e){
        res.status(500).json({
        success: false,
        error: "Email already exists : " + e
        })
    }
})

userRouter.post('/signin', async(req:Request, res:Response)=>{
    const requireBody = z.object({
        email:z.email(),
        password:z.string().min(6),
    })
    const parseData = requireBody.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json({
            success:false,
            data:{
                error:"erron in zod parsing: " +  parseData.error
            }
        })
    }
    const {email , password }  = parseData.data;

    
    try{
        const user = await UserModel.findOne({email:email});
        if(!user){
            return res.status(403).json({
                success:false,
                data : "No user with this email"
            })
        }
        const comparePassword  = await bcrypt.compare(password, user.password);
        if(comparePassword){
           const token =  jwt.sign({
              id: user._id ,
              role:user.role
            },JWT_SECRET );
            res.cookie('token' , token , {
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:1000*60*60*24*7
            })
            console.log('token: '+ token);
            res.status(200).json({
                success:true,
                data:{
                    msg:user.name+ " logged in "
                }
            })
        }
    }catch(e){
        res.status(500).json({
                success:false,
                data:{
                    msg:"error :  " + e
                }
            })
    }
});

userRouter.post('/create/class' , userMiddleware , requireRole(['teacher']) , 
async (req:Request , res:Response) => {
    const requireBody = z.object({
        className: z.string(),
        studentIds: z.string().array()
    })
    const parseData = requireBody.safeParse(req.body);
    
    if(!parseData.success){
        return res.status(400).json({
            success:false,
            data:{
                error:"erron in zod parsing: " +  parseData.error
            }
        })
    }
    const {className ,  studentIds}  = parseData.data;

    try{
        await ClassModel.create({
            className:className,
            teacherId:req.userId,
            studentIds:studentIds
        })
    }catch(e){

    }
})
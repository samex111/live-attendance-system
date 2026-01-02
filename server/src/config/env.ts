import dotenv from 'dotenv'
dotenv.config();
export const MONGO_URI  = process.env.MONGO_URI as string ;
export const JWT_STUDENT = process.env.JWT_STUDENT as string;
export const JWT_TEACHER = process.env.JWT_TEACHER as string ;
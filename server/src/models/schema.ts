import mongoose , { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema({
     name: {type:String, required:true},
     email: {type:String, required:true, unique:true},
     password:{type:String, required:true},
     role: {type:String,enum:["teacher","student"], required:true},
},{timestamps:true});

const ClassSchema = new Schema({
    className: {type:String, required:true},
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    studentIds: {type:[mongoose.Schema.Types.ObjectId], ref:'User', default:[]}
},{timestamps:true});

const AttendanceSchema = new Schema({
    classId: {type: mongoose.Schema.Types.ObjectId,ref: 'Class', required:true},
    studentId: {type: mongoose.Schema.Types.ObjectId,ref: 'User', required:true},
    status:{type:String, enum:['present', 'absent'] , required:true}
},{timestamps:true});

UserSchema.pre('save', async function (){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

export const UserModel = mongoose.model('User', UserSchema);
export const ClassModel = mongoose.model('Class', ClassSchema);
export const AttendanceModel = mongoose.model('Attendance', AttendanceSchema);
import mongoose , { Schema } from "mongoose";
const UserSchema = new Schema({
     name: {type:String, required:true},
     email: {type:String, required:true, unique:true},
     password:{type:String, required:true},
     role: {type:String,enum:["teacher","student"], required:true},
});
const ClassSchema = new Schema({
    className: {type:String, required:true},
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref:'user',required:true},
    studentIds: {type:[mongoose.Schema.Types.ObjectId], ref:'user', default:[]}
});
const AttendanceSchema = new Schema({
    classId: {type: mongoose.Schema.Types.ObjectId,ref: 'class', required:true},
    studentId: {type: mongoose.Schema.Types.ObjectId,ref: 'user', required:true},
    status:{type:String, enum:['present', 'absent'] , required:true}
});

export const UserModel = mongoose.model('user', UserSchema);
export const ClassModel = mongoose.model('class', ClassSchema);
export const AttendanceModel = mongoose.model('attendance', AttendanceSchema);
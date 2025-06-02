// mongoose, Schema , Document
import mongoose , {Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date
};

const messageSchema :Schema<Message>  =new Schema({
    content :{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean
    isAcceptingMessage:boolean;
    messages:Message[]
};

const userSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verifyCode is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages: [messageSchema]

})

const User = mongoose.models.users as mongoose.Model<User> || mongoose.model<User>("users",userSchema)

export default User
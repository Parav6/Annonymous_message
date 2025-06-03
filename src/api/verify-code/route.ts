import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    dbConnect();
    try {
        const {username,code} = await request.json();
        const user = await User.findOne({username});

        if(!user){
            return NextResponse.json({
                    success:false,
                    message:"user not found"
                },{status:500})
        };

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save;

            return NextResponse.json({
                    success:true,
                    message:"account verified"
                },{status:200})
        }else if(!isCodeNotExpired){
            return NextResponse.json({
                    success:false,
                    message:"verification code expired please sign up again"
                },{status:400})
        }else{
            return NextResponse.json({
                    success:false,
                    message:"incorrect verification code"
                },{status:500})
        }
    } catch (error) {
         console.log(`error verifying user ${error}`)
                return NextResponse.json({
                    success:false,
                    message:"error verifying user"
                },{status:500})
    }
}
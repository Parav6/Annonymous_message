import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req:NextRequest){
    await dbConnect();

    try {
        const {username,email,password} = await req.json();
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified:true
        });
        if(existingVerifiedUser){
            return NextResponse.json({
                success:false,
                message:"username is already taken"
            },{status:400});
        };
        const existingUserByEmail = await User.findOne({email});
        const verifyCode = Math.floor(100000+ Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                success:false,
                message:"User already exist with this email"
            },{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new User({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save();
        }
        //send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        console.log(emailResponse);

        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }

        return NextResponse.json({
                success:true,
                message:"user registered successfully , please verify your email"
                     },{status:500})
    
    } catch (error) {
        console.error(`error registering user ${error}`)
        return NextResponse.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
};
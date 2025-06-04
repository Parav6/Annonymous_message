import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import {Message} from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    await dbConnect();

    const {username,content} = await request.json();

    try {
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                    success:false,
                    message:"user not found"
                        },{status:404})
        };

        if(!user.isAcceptingMessage){
            return NextResponse.json({
                    success:false,
                    message:"user is not accepting messages"
                        },{status:403})
        };

        const newMessage = {content,createdAt:new Date()};

        user.messages.push(newMessage as Message)
        await user.save();

        return NextResponse.json({
                    success:true,
                    message:"message sent successfully"
                        },{status:200})
    } catch (error) {
        console.log(`unable to send messages ${error}`)
        return NextResponse.json({
                    success:false,
                    message:"unable to send messages"
                        },{status:500})
    }
}

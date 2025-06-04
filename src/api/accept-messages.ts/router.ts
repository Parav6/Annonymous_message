import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
// import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user ;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated"
                },{status:401})
    };

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new : true}
        );

        if(!updatedUser){
            return NextResponse.json({
            success:false,
            message:"failed to update user status"
                },{status:401})
        };

        return NextResponse.json({
            success:true,
            message:"message acceptance status updated successfully",
            updatedUser
                },{status:200})
    
        
    } catch (error) {
        console.log("failed to update user status",error)
         return NextResponse.json({
                success:false,
                message:"failed to update user status"
                },{status:500})
    }
};

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user ;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated"
                },{status:401})
    };

    const userId = user._id;

    try {
        const foundUser = await User.findById(userId);
    
        if(!foundUser){
            return NextResponse.json({
                success:false,
                message:"user not found"
                    },{status:404})
        };
    
        return NextResponse.json({
                success:true,
                isAcceptingMessage: foundUser.isAcceptingMessage
                    },{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:"getting error is acceptingMessages status update"
                },{status:500})
    }
}
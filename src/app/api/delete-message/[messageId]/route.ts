import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
// import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function DELETE(request:Request, {params}:{params: {messageId: string}}){
    const messageId = params.messageId;
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated"
                },{status:401})
    };

    try {
        const updatedResult = await User.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id :messageId}}}
        );
        if(updatedResult.modifiedCount){
            return NextResponse.json({
            success:false,
            message:"message not found or already deleted"
                },{status:404})
        };
        return NextResponse.json({
            success:true,
            message:"message deleted"
                },{status:201})
    } catch (error) {
        console.log("error deleting message",error)
        return NextResponse.json({
            success:false,
            message:"Error deleting message"
                },{status:500})
    }

    
}
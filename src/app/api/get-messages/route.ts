import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
// import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated"
                },{status:401})
    };

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await User.aggregate([
            {$match : {_id : userId} },
            {$unwind : "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group:{_id : "$_id",messages:{$push:"$messages"}}},
        ]);

        if(!user || user.length===0){
            return NextResponse.json({
            success:false,
            message:"user not found"
                },{status:401})
        };

        return NextResponse.json({
            success:true,
            messages : user[0].messages
                },{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success:false,
            message:error
                },{status:500})
    }
}
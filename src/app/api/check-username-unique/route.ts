import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request){
    dbConnect()
    try {
        const {searchParams} = new URL(request.url)  //get query parameters
        const queryParam = {
            username:searchParams.get("username")
        };
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors
            },{status:400})
        }
        const {username} = result.data;

        const existingVerifiedUser = await User.findOne({username,isVerified:true});

        if(existingVerifiedUser){
             return Response.json({
                success:false,
                message:"username is already taken"
            },{status:400})
        };

         return Response.json({
                success:true,
                message:"username is unique"
            },{status:200})

    } catch (error) {
        console.log(`error checking username ${error}`)
        return NextResponse.json({
            success:false,
            message:"error checking username"
        },{status:500})
    }
}
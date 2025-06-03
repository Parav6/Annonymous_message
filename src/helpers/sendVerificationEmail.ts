import {resend} from "../lib/resend";
import {EmailTemplate} from "../../emails/verificationEmails"
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
    try {
    await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to:email,
    subject:"Mystery message | Verification Code",
    react: EmailTemplate({ username, otp:verifyCode})
  });
        return{success:true , message:"email send successfully"}
    } catch (error) {
       console.error("error in sending verification email",error)
       return{success:false , message:"failed to send email"} 
    }
}
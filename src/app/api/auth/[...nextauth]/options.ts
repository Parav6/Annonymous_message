import { NextAuthOptions } from "next-auth";
import   CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or:[{email:credentials.identifier.email},
                            {username:credentials.identifier.username}
                        ]
                    });
                    if(!user){
                        throw new Error("no user found with email")
                    };
                    if(!user.isVerified){
                        throw new Error("please verify your account before login")
                    };
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("password is incorrect")
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async session({ session, token}) { 
            if(token){
                session.user._id = token._id; 
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
        return session
        },
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerifier = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            };
            return token
        }
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
       strategy:"jwt" 
    },
    secret: process.env.NEXTAUTH_SECRET,
}


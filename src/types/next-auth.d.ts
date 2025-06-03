import "next-auth";

declare module "next-auth"{
    interface User {
        _id? : string;
        isVerified?: boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }
    interface Session {
        user:{
            _id? : string;
            isVerified?: boolean;
            isAcceptingMessages?:boolean;
            username?:string
        } & DefaultSession("user")   //it always return a user key in session whether it is empty
    }
    interface JWT {
         _id? : string;
        isVerified?: boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }
}
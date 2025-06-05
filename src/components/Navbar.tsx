"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";  // that we made during log in 
import {User} from "next-auth"
import { Button } from "./ui/button";

const Navbar = ()=>{

   const {data:session} = useSession();
   console.log(session)

   const user: User = session?.user;


    return(
        <>
        <nav>
            <a href="#">Mystery message</a>
            {
                session? (
                    <>
                    <span>Welcome , {user.username || user.email} </span>
                    <Button onClick={()=>{signOut()}}>LogOut</Button>
                    </>
                ):(
                    <Link href="/sign-in">
                        <Button>Login</Button>
                    </Link>
                )
            }
        </nav>
        </>
    )
};

export default Navbar
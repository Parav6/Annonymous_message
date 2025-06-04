"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"
import { signUpSchema } from "@/schemas/signUpSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SignInPage =()=>{
    const [username,setUsername] = useState("");
    const [usernameMessage,setUsernameMessage] = useState("");
    const [isCheckingUsername,setIsCheckingUsername] = useState(false);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const router = useRouter();
    //usehook-ts------useDebounceValue--------------

    // const debouncedUsername = useDebounceValue(username,300);
    const debounced = useDebounceCallback(setUsername,300)
    
    //zod implementation
    const form = useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
    });
    //---

    useEffect(()=>{
        const checkUsernameUnique = async()=>{
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage("");  //?
                try {
                    const res = await axios(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(res.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "error checking username"
                    );
                }finally{
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }
    ,[username]);

    const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true);
        try {
            console.log(data)
            const res = await axios.post("/api/sign-up",data);
            toast("Success",res.data.message);
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error(`error in sign up of user`);
            const axiosError = error as AxiosError;
            let errorMessage = axiosError.response?.data.message;
            toast("Sign up failed",errorMessage);
            setIsSubmitting(false);
        }
    };


    return(
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} 
                                onChange={(e)=>{field.onChange(e); debounced(e.target.value)}}
                                />
                            </FormControl>
                            {isCheckingUsername && "loading..."}
                            <p>
                                {usernameMessage}
                            </p>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting?("Submitting Form..."):("Signup")
                            }
                        </Button>
                </form>
            </Form>
        </>
    )
};

export default SignInPage
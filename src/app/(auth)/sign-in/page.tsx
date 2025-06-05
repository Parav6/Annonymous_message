"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const SignInPage =()=>{
    const [isSubmitting,setIsSubmitting] = useState(false);
    const router = useRouter();
    
    //zod implementation
    const form = useForm({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    });
    //---

    const onSubmit = async(data: z.infer<typeof signInSchema>)=>{
        setIsSubmitting(true)
        const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        });

        if(response?.error){
            toast("Login failed")
        };

        if(response?.url){
            router.replace("/dashboard")
        };
    };


    return(
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email/Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Email/Username" {...field} />
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
                                isSubmitting?("Submitting Form..."):("SignIn")
                            }
                        </Button>
                </form>
            </Form>
        </>
    )
};

export default SignInPage
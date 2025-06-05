"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import * as z from "zod";

const VerifyPage = ()=>{
    const router = useRouter();
    const param = useParams<{username:string}>();

    //zod implementation
    const form = useForm({
            resolver:zodResolver(verifySchema)
        });

    const onSubmit = async(data: z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post("/api/verify-code",{
                username:param.username,
                code: data.code
            });

            toast("Success",response.data.message);
            router.replace("sign-in")
        } catch (error) {
             console.error(`error in verification of user`);
                let errorMessage = axiosError.response?.data.message;
                const axiosError = error as AxiosError;
                toast("Verification failed",errorMessage);           
        }
    };    

    return(
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="OTP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    )    

};

export default VerifyPage
"use client"

import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = ()=>{

    const [messages,setMessages] = useState<Message[]>([]);
    const[isLoading,setIsLoading] = useState(false);
    const [isSwitchLoading,setIsSwitchLoading] = useState(false);

    const handleDeleteMessage = (messageId:string)=>{
        setMessages(messages.filter((message)=>message._id!==messageId));
    }; 

    const {data: session} = useSession();

    const form = useForm({
        resolver:zodResolver(acceptMessageSchema)
    });

    const {register,watch,setValue} = form;
    const acceptMessages = watch("acceptMessages");

    const  fetchAcceptMessage = useCallback(async()=>{
        setIsSwitchLoading(true);

        try {
            const res = await axios("/api/accept-messages")
            setValue("acceptMessage",res.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError
            toast("Error",axiosError.res?.data.message)
        }finally{
            setIsSwitchLoading(false)
        }
    },[setValue]);

    const fetchMessages = useCallback(async(refresh:boolean = false)=>{
        setIsLoading(true);
        setIsSwitchLoading(false);

        try {
            const res = await axios("/api/get-messages");
            setMessages(res.data.messages || []);
            
            if(refresh){
                toast("showing latest messages")
            }
        } catch (error) {
            const axiosError = error as AxiosError
            toast("Error",axiosError.res?.data.message)
        }finally{
            setIsSwitchLoading(false)
            setIsLoading(false)
        }
    },[])

    useEffect(()=>{
        if(!session|| !session.user) return;

        fetchMessages();
        fetchAcceptMessage();
    },[session,setValue,fetchAcceptMessage,fetchMessages]);

    //handle switch change
    const handleSwitchChange = async()=>{
        try {
            const res = await axios.post("/api/accept-messages",{
                acceptMessages : !acceptMessages
            });

            setValue("acceptMessage",!acceptMessages);
            toast(res.data.message);
        } catch (error) {
            const axiosError = error as AxiosError
            toast("Error",axiosError.res?.data.message)
        }
    };

    const {username}= session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard =()=>{
        navigator.clipboard.writeText(profileUrl);
        toast("Url copied")
    };

    if (!session || !session.user) {
        return <div>please login</div>
    } 

    return(
        <>
    {/* pending frontend */}
        </>
    )
};

export default Dashboard
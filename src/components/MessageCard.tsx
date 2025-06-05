"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { Message } from "@/models/user.model";
import axios from "axios";
import { toast } from "sonner";

type MessageCardProp = {
    message :Message;
    onMessageDelete : (messageId: string)=>void
};

const MessageCard = ({message,onMessageDelete}:MessageCardProp)=>{

    const handleDeleteConfirm = async()=>{
        const res = await axios.delete(`/api/delete-message/${message._id}`);
        toast(res.data.message);
        onMessageDelete(message._id);
    };


    return(
        <>
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
        </>
    )
};

export default MessageCard
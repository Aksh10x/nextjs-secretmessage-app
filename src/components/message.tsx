"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import { X } from "lucide-react";
import { Message } from "@/model/user.model";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
    
type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void
}
  
const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const {toast} = useToast()

    const handleDeleteConfirm = async( ) => {
        const response = await axios.delete(`/api/delete-message/${message._id}`)

        toast({
            title: "Success",
            description: response.data.message
        })

        onMessageDelete(message._id)

    }
    return ( 
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-5 h-8"><X/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this message.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <CardDescription>{message.createdAt}</CardDescription>
                </CardHeader>
                <CardContent>
                    
                </CardContent>
                
            </Card>

        </div>
     );
}


 
export default MessageCard;
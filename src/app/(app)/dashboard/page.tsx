"use client"
import MessageCard from "@/components/message";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
    const [messages, setMessages] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const {toast} = useToast()

    const handleDeleteMessage = (messageId : string) => {
        setMessages(messages.filter((msg : any) => {
            msg._id !== messageId
        }))
    }

    const {data: session} = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, watch, setValue} = form

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessages = useCallback(async() => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>("/api/accept-messages")
        setValue("acceptMessages", response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Failure',
                description: axiosError.response?.data.message
            })

        }
        finally {
            setIsSwitchLoading(false)
        }
    },[setValue])

    const fetchMessages = useCallback(async(refresh : boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get("/api/get-messages")
            let array = response.data.data.map((m : any) => {
                return m.messages
            })
            setMessages(array)
            if(refresh){
                toast({
                    title: "Refreshed messages",
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Failure',
                description: axiosError.response?.data.message
            })
        } finally{
            setIsLoading(false)
        }
        
    },[setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user) return

        fetchMessages()
        fetchAcceptMessages()
    },[session, setValue, fetchAcceptMessages, fetchMessages,])

    useEffect(() => {},[])

    const handleSwitchChange = async() => {
        try {
            await axios.post("/api/accept-messages", {
                acceptMessages: !acceptMessages,
            })

            setValue("acceptMessages", !acceptMessages)
            toast({
                title: "Success",
                description: "Message acceptance status changed"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Failure',
                description: axiosError.response?.data.message
            })
        }
    }

    const username = session?.user.username

    const copyUrl = `${window.location.protocol}//${window.location.host}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(copyUrl)
        toast({
            title: "Link copied",
            description: "Share the link with your friends and get secret messages!"
        })
    }

    if(!session || !session.user){
        return (
            <div>Please login</div>
        )
    }
    return ( 
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={copyUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-yellow-200 rounded bg-opacity-55"
          />
          <button onClick={copyToClipboard} className="cursor-pointer bg-gray-900 px-2 py-4 flex justify-center h-8 rounded items-center text-white font-semibold text-sm">Copy</button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator/>

      <Button
        className="mt-4"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    );
}

 
export default Dashboard;
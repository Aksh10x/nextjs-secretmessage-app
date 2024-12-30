"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import {useDebounceCallback} from "usehooks-ts"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@react-email/components";
import { Loader2 } from "lucide-react";



const SignUp = () => {

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")

  const [isChceckingUsername, setIsCheckingUsername] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300) //so we will check this value instead of actual username

  const {toast} = useToast()

  const router = useRouter();

  //zod

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async ( ) => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(response)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>

          setUsernameMessage(axiosError.response?.data.message || "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
        
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async(data : z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post("/api/sign-up", data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      let errorMessage = axiosError.response?.data.message

      toast({
        title: "Oops, signup failed.",
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[28vw] bg-white p-6 rounded-lg shadow-2xl min-h-[450px] border-yellow-300 border-2">
        <div className="break-words text-3xl font-bold text-yellow-400 text-center">Sign-up and be a secret messanger</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col items-center">
            <FormField 
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} 
                    onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                    className="bg-white"/>
                  </FormControl>
                  <div className={`h-[10px] flex w-full ${usernameMessage === "Username is unique" ? 'text-green-600' : 'text-red-700'}`}>
                    {isChceckingUsername ? (<Loader2 className="animate-spin text-yellow-500"/>) : (<></>)}
                    <p className="text-[10px]">{usernameMessage}</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} className="bg-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} className="bg-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" aria-disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <Loader2 className="animate-spin"/>
                ) : (<div  className="cursor-pointer bg-yellow-300 px-2 py-3 rounded-lg text-white font-bold shadow-2xl">Sign-up</div>)
              }
            </Button>

          </form>
        </Form>

      </div>
    </div>
    );
}
 
export default SignUp;
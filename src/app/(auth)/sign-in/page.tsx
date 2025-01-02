"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";



const SignIn = () => {

  const [username, setUsername] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)


  const {toast} = useToast()

  const router = useRouter();

  //zod

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })


  const onSubmit = async(data : z.infer<typeof signinSchema>) => {
    
    setIsSubmitting(true)
    const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password
    })

    if(result?.error){
        toast({
            title: "Login failed",
            description: "Incorrect username or password.",
            variant: "destructive"
        })
    }

    if(result?.url){
        router.replace("/dashboard")
    }
    
  }

  
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[28vw] bg-white p-6 rounded-lg shadow-2xl min-h-[450px] border-yellow-300 border-2">
        <div className="break-words text-3xl font-bold text-yellow-400 text-center">Sign-in and be a secret messanger</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col items-center">

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} className="bg-white"/>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} className="bg-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="font-bold">
              {
                isSubmitting ? (
                  <Loader2 className="animate-spin"/>
                ) : ("Sign-in")
              }
            </Button>

          </form>
        </Form>
        <div className="flex justify-center items-center  text-sm">
          <span className=" flex ">
            <p>Don't have an account?</p>
            <Link href={"/sign-up"} className="text-blue-500">Sign-up</Link>
          </span>
        </div>
      </div>
    </div>
    );
}
 
export default SignIn;
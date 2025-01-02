"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";


const Verify = () => {

    const router = useRouter();

    const param = useParams<{username: string}>()

    const {toast} = useToast()

    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
          code: "",
        }
      })

    const onSubmit = async(data : z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify-code", {
                username: param.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace("/sign-in")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Failed to verify",
                description: axiosError.response?.data.message
            })
        }
    }  
    return ( 
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[28vw] bg-white p-6 rounded-lg shadow-2xl min-h-[450px] border-yellow-300 border-2">
                <div className="break-words text-3xl font-bold text-yellow-400 text-center">Verify your account</div>
                <div className="break-words text-xs mt-4 font-bold text-center text-yellow-400">A 6 digit verification code has been sent to your email address!</div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
                        <FormField 
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your 6 digit code" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="font-bold">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
     );
}
 
export default Verify;
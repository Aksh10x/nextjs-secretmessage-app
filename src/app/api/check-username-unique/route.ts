import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request){

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username"),
        }
        const result = usernameQuerySchema.safeParse(queryParams)  //zod validation

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return NextResponse.json({
                success: false,
                message: usernameErrors,
                status: 400
            })
        }
        const {username} = result.data

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken",
                status: 400,
            });
        }
        return NextResponse.json({
            success: true,
            message: "Username is unique",
            status: 200,
        });

    } 
    catch (error) {
        console.log("Error checking username", error)
        return NextResponse.json(
            {
                success: "false",
                message: "Error checking username",
                status:  500,
            }
        )
    }
}
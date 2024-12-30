import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request){

    await dbConnect()
    try {
        const {username, code} = await request.json()

        const user = await UserModel.findOne({
            username,
        })

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found",
                status: 400
            })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return NextResponse.json({
                success: true,
                message: "User registered successfully",
                status: 200
            })
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "The verification code is expired",
                status: 400
            })
        }
        else {
            return NextResponse.json({
                success: false,
                message: "The verification code is invalid",
                status: 400
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error verifying user",
            status: 500
        })
    }
}
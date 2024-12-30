import UserModel from "@/model/user.model";
import { messageSchema } from "@/schemas/messageSchema";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user.model";
import { NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found",
                status: 404
            })
        }

        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages",
                status: 403
            })
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message)

        await user.save({validateBeforeSave: false})

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Could not send message",
            status: 500
        })
    }
}
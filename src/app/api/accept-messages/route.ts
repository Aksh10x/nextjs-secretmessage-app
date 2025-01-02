import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user
    
    if(!(session || user)){
        return NextResponse.json({
            success: false,
            message: "Not authenicated",
            status: 401
        })
    }


    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessage: acceptMessages}, 
            {new: true}
        )

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                message: "Could not update user",
                status: 401
            })
        }

        return NextResponse.json({
            success: true,
            message: "Not authenicated",
            data: updatedUser,
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Could not update user accept message status",
            status: 500
        })
    }
}

export async function GET(request: Request){

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user
    
    if(!(session || user)){
        return NextResponse.json({
            success: false,
            message: "Not authenicated",
            status: 401
        })
    }

    const userId = user._id

    try {
        const dataUser = await UserModel.findById(
            userId
        )

        if(!dataUser){
            return NextResponse.json({
                success: false,
                message: "Could not update user",
                status: 401
            })
        }

        const acceptMessageStatus = dataUser.isAcceptingMessage

        return NextResponse.json({
            success: true,
            message: "Data retrieved successfully",
            data: {
                isAcceptingMessages: acceptMessageStatus
            },
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Could not get status",
            status: 500
        })
    }
}